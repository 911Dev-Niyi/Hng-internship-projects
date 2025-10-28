🚀 HNG Internship Stage 2 — Country Data API
This project is a RESTful API built for the HNG Internship Stage 2 backend task. It manages country data, supports filtering and sorting, and integrates external APIs for currency and population insights.

📌 Features
Refresh country data from external APIs

Store and update countries with GDP estimates

Filter, sort, and paginate country listings

Retrieve individual country details

Delete countries by name

Serve a summary image of top GDP countries

Robust error handling for validation, missing data, and external failures

🛠️ Tech Stack
Node.js

Express.js

MySQL

Axios

dotenv

⚙️ Setup Instructions
1. Clone the Repository
bash
git clone https://github.com/911Dev-Niyi/Hng-internship-projects.git
cd hng/stage2/
2. Install Dependencies
bash
npm install
3. Run the Server Locally
bash
npm run dev
4. Environment Variables
Create a .env file with the following:

Code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
EXCHANGE_API_KEY=yourkey
🧪 Testing the Endpoints
🔹 Refresh Country Data POST /countries/refresh Fetches and stores country data, calculates GDP, and generates summary image.

🔹 Get All Countries GET /countries Supports filters:

?region=Africa

?currency=NGN

?sort=gdp_desc

?page=2&limit=10 (optional pagination)

🔹 Get Country by Name GET /countries/Nigeria Returns details for a single country.

🔹 Delete Country DELETE /countries/Nigeria Deletes a country by name.

🔹 Get Summary Image GET /countries/image Returns the generated summary image. If missing:

json
{ "error": "Summary image not found" }
❌ Error Handling
400 Bad Request

json
{ "error": "Validation failed" }
404 Not Found

json
{ "error": "Country not found" }
500 Internal Server Error

json
{ "error": "Internal server error" }
503 Service Unavailable

json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from [API name]"
}
📦 Dependencies
express — Web framework

mysql2 — Database connector

axios — External API calls

dotenv — Environment config

🌐 Live Deployment
You can test the live API here: 🔗 (deployment link to be added)

📣 Author
Adeniyi Anjorin Backend Developer 📧 anjorinadeniyi1811@gmail.com