# 🚀 HNG Internship Stage 1 — String Analysis API

This project is a RESTful API built for the HNG Internship Stage 1 backend task. It analyzes strings, computes properties, and supports filtering via query parameters and natural language.

---

## 📌 Features

- Analyze strings for length, word count, palindrome status, character frequency, and more
- Filter strings using query parameters or natural language
- SHA-256 hash-based identification
- Full CRUD support
- Error handling for invalid input, duplicates, and conflicting filters

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- crypto (built-in)
- CORS

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/911Dev-Niyi/Hng-internship-projects.git
cd hng/stage1/

2. Install Dependencies
npm install

3. Run the Server Locally
node index.js


🧪 Testing the Endpoints

🔹 Create/Analyze String
POST /strings
Body: { "value": "racecar" }

🔹 Get Specific String
GET /strings/racecar

🔹 Filter with Query Parameters
GET /strings?is_palindrome=true&min_length=5

🔹 Filter with Natural Language
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings

🔹 Delete String
DELETE /strings/racecar

❌ Error Handling
400 Bad Request: Missing or invalid input

409 Conflict: Duplicate string

422 Unprocessable Entity: Conflicting filters

404 Not Found: String not found

📦 Dependencies
express — Web framework

cors — Enables cross-origin requests
```
 ### 📣 Author
Adeniyi Anjorin Backend Developer 📧 anjorinadeniyi1811@gmail.com