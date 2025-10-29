import axios from "axios";
import { db } from "../models/db.js";


import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Retry wrapper for GET requests
const fetchWithRetry = async (url, retries = 3, delayMs = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
};

const ensureCountriesTableExists = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      capital VARCHAR(100),
      region VARCHAR(100),
      population BIGINT,
      currency_code VARCHAR(10),
      exchange_rate DECIMAL(10, 4),
      estimated_gdp DECIMAL(15, 2),
      flag_url TEXT,
      last_refreshed_at DATETIME
    );
  `);
};


export const refreshCountries = async (req, res) => {
  try {

    await ensureCountriesTableExists(db);
    // Parallel fetch with retry
    const [countriesData, ratesData] = await Promise.all([
      fetchWithRetry(
        "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"
      ),
      fetchWithRetry("https://open.er-api.com/v6/latest/USD"),
    ]);

    const countries = countriesData;
    const rates = ratesData?.rates ?? ratesData;

    // Clear old data (safe delete)
    await db.query("DELETE FROM countries WHERE id > 0");

    // Timestamp for this refresh
    const refreshedAt = new Date();

    // Build batch values
    const values = [];
    // For quick tests, uncomment the next line
    // const workList = countries.slice(0, 20);
    const workList = countries;

    for (const country of workList) {
      const name = country.name;
      const capital = country.capital || null;
      const region = country.region || null;
      const population = country.population || 0;
      const flag_url = country.flag || null;

      // Currency rules: only first currency; skip if none
      if (!country.currencies || country.currencies.length === 0) continue;
      const currency = country.currencies[0]?.code || null;
      if (!currency) continue;

      const exchange_rate = rates?.[currency] ?? null;
      // If exchange rate is missing, skip storing (per spec)
      if (!exchange_rate) continue;

      const multiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      const estimated_gdp = (population * multiplier) / exchange_rate;

      values.push([
        name,
        capital,
        region,
        population,
        currency,
        exchange_rate,
        estimated_gdp,
        flag_url,
        refreshedAt,
      ]);
    }

    if (values.length === 0) {
      return res.status(200).json({
        message: "Refresh completed: no valid rows to insert",
        inserted: 0,
      });
    }

    // Batch insert (mysql2 supports VALUES ? with nested arrays)
    const insertQuery = `
      INSERT INTO countries
        (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
      VALUES ?
    `;
    await db.query(insertQuery, [values]);

    return res.status(200).json({
      message: "Countries refreshed and cached successfully",
      inserted: values.length,
    });
  } catch (err) {
    console.error("Refresh failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCountries = async (req, res) => {
  try {
    const {
      region,
      currency,
      name,
      sort,
      page,
      limit 
    } = req.query;

    // Base query
    let query = "SELECT * FROM countries WHERE 1=1";
    const params = [];

    if ("name" in req.query && !req.query.name.trim()) {
      return res.status(400).json({
        error: "Validation failed",
        details: { name: "cannot be blank" },
      });
    }

    // Filters
    if (region) {
      query += " AND region = ?";
      params.push(region);
    }
    if (currency) {
      query += " AND currency_code = ?";
      params.push(currency);
    }
    if (name) {
      query += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    // Sorting
    if (sort) {
      const [field, direction] = sort.split("_");
      const validFields = {
        population: "population",
        gdp: "estimated_gdp",
        name: "name",
      };
      const validDirections = ["asc", "desc"];

      if (
        validFields[field] &&
        validDirections.includes(direction.toLowerCase())
      ) {
        query += ` ORDER BY ${validFields[field]} ${direction.toUpperCase()}`;
      }
    }

    // Pagination
    if (page || limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 50;
      const offset = (pageNum - 1) * limitNum;
      query += ` LIMIT ${limitNum} OFFSET ${offset}`;
    }

    const [rows] = await db.query(query, params);

    res.status(200).json({
      count: rows.length,
      results: rows,
    });
  } catch (err) {
    console.error("GET /countries failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCountryByName = async (req, res) => {
  try {
    const name = req.params.name;

    if (!name) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: { name: "is required" } });
    }

    const [rows] = await db.query("SELECT * FROM countries WHERE name = ?", [
      name,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Country not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error(" GET /countires/:name failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCountryByName = async (req, res) => {
  try {
    const name = req.params.name;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: { name: "is required" } });
    }

    const [result] = await db.query(
      "DELETE FROM countries WHERE LOWER(name) = LOWER(?)",
      [name]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: " Country not found" });
    }

    return res
      .status(200)
      .json({ message: `Country '${name}' deleted successfully` });
  } catch (err) {
    console.error("DELETE /countries/:name failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getStatus = async (req, res) => {
  try {
    const [[countRow]] = await db.query(
      "SELECT COUNT(*) AS total FROM countries"
    );
    const [[tsRow]] = await db.query(
      "SELECT MAX(last_refreshed_at) AS last_refreshed_at FROM countries"
    );

    return res.status(200).json({
      total_countries: countRow.total,
      last_refreshed_at: tsRow.last_refreshed_at,
    });
  } catch (err) {
    console.error("GET /status failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getCountriesImage = (req, res) => {
  const imagePath = path.join(__dirname, '../cache/summary.png');
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Summary image not found' });
  }

  res.sendFile(imagePath);
};

