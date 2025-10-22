import { analyzeString } from '../services/stringAnalyzer.js';
import {
  saveString,
  getString,
  deleteString,
  getAllStrings,
} from '../models/stringStore.js';
import { parseNaturalLanguage } from '../utils/naturalLanguageParser.js';

export function createString(req, res) {
  const { value } = req.body;

  if (!('value' in req.body)) {
    return res.status(400).json({ error: '"value" is required' });
  }

  if (typeof value !== 'string') {
    return res.status(422).json({ error: '"value" must be a string' });
  }

  if (getString(value)) {
    return res.status(409).json({ error: 'String already exists' });
  }

  const properties = analyzeString(value);
  const created_at = new Date().toISOString();
  const id = properties.sha256_hash;

  const storedObject = {
    id,
    value,
    properties,
    created_at,
  };

  saveString(value, storedObject);
  res.status(201).json(storedObject);
}

export function getStringByValue(req, res) {
  const { value } = req.params;
  const result = getString(value);

  if (!result) {
    return res.status(404).json({ error: 'String not found' });
  }

  res.status(200).json(result);
}

export function deleteStringByValue(req, res) {
  const { value } = req.params;
  if (!getString(value)) {
    return res.status(404).json({ error: 'String not found' });
  }

  deleteString(value);
  res.status(204).send();
}

export function getFilteredStrings(req, res) {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = req.query;

  let results = getAllStrings();

  try {
    if (is_palindrome !== undefined) {
      if (is_palindrome !== 'true' && is_palindrome !== 'false') {
        return res.status(400).json({ error: 'is_palindrome must be "true" or "false"' });
      }
      const bool = is_palindrome === 'true';
      results = results.filter((s) => s.properties.is_palindrome === bool);
    }

    if (min_length !== undefined) {
      const min = parseInt(min_length);
      if (isNaN(min)) return res.status(400).json({ error: 'min_length must be a number' });
      results = results.filter((s) => s.properties.length >= min);
    }

    if (max_length !== undefined) {
      const max = parseInt(max_length);
      if (isNaN(max)) return res.status(400).json({ error: 'max_length must be a number' });
      results = results.filter((s) => s.properties.length <= max);
    }

    if (word_count !== undefined) {
      const wc = parseInt(word_count);
      if (isNaN(wc)) return res.status(400).json({ error: 'word_count must be a number' });
      results = results.filter((s) => s.properties.word_count === wc);
    }

    if (contains_character !== undefined) {
      if (typeof contains_character !== 'string' || contains_character.length !== 1) {
        return res.status(400).json({ error: 'contains_character must be a single character' });
      }
      results = results.filter((s) => s.value.includes(contains_character));
    }

    res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: {
        ...(is_palindrome !== undefined && { is_palindrome: is_palindrome === 'true' }),
        ...(min_length !== undefined && { min_length: parseInt(min_length) }),
        ...(max_length !== undefined && { max_length: parseInt(max_length) }),
        ...(word_count !== undefined && { word_count: parseInt(word_count) }),
        ...(contains_character !== undefined && { contains_character }),
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export function filterByNaturalLanguage(req, res) {
    const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query must be a string' });
  }

  try {
    const { filters, interpreted_query } = parseNaturalLanguage(query);
    let results = getAllStrings();

    if (filters.is_palindrome !== undefined) {
      results = results.filter((s) => s.properties.is_palindrome === filters.is_palindrome);
    }
    if (filters.min_length !== undefined) {
      results = results.filter((s) => s.properties.length >= filters.min_length);
    }
    if (filters.max_length !== undefined) {
      results = results.filter((s) => s.properties.length <= filters.max_length);
    }
    if (filters.word_count !== undefined) {
      results = results.filter((s) => s.properties.word_count === filters.word_count);
    }
    if (filters.contains_character !== undefined) {
      results = results.filter((s) => s.value.includes(filters.contains_character));
    }
    if (
  filters.min_length !== undefined &&
  filters.max_length !== undefined &&
  filters.min_length > filters.max_length
) {
  return res.status(422).json({ error: 'Query parsed but resulted in conflicting filters' });
}

if (
  filters.word_count !== undefined &&
  (typeof filters.word_count !== 'number' || filters.word_count < 0)
) {
  return res.status(422).json({ error: 'Query parsed but resulted in conflicting filters' });
}

if (
  filters.contains_character !== undefined &&
  (typeof filters.contains_character !== 'string' || filters.contains_character.length !== 1)
) {
  return res.status(422).json({ error: 'Query parsed but resulted in conflicting filters' });
}



    res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: filters,
      },
    });
  } catch (err) {
    res.status(400).json({ error: 'Unable to parse natural language query' });
  }
}