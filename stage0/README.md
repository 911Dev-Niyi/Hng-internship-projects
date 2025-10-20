# 🚀 HNG Internship Stage 0 — Dynamic Profile Endpoint

This project is a simple RESTful API built for the HNG Internship Stage 0 backend task. It returns my profile information along with a dynamic cat fact fetched from an external API.

---

## 📌 Features

- GET `/` endpoint for status message
- GET `/me` endpoint for profile information
- Dynamic cat fact from [Cat Facts API](https://catfact.ninja/fact)
- Current UTC timestamp in ISO 8601 format
- Graceful error handling and fallback messaging
- Uses environment variables for configuration

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Axios
- dotenv
- CORS

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/911Dev-Niyi/Hng-internship-projects.git
cd hng/stage0/
2. Install Dependencies
bash
npm install
3. Create a .env File
env
MY_NAME=Your Name
MY_EMAIL=Your Email
MY_STACK=Your Stack
4. Run the Server Locally (Optional)
bash
node server.js
🧪 Testing the Endpoint
🔹 Local Testing (before deployment)
bash
curl http://127.0.0.1:3000/me
🔹 Hosted Testing (after deployment)
bash
curl https://niyi-hnginternship-stage0project.pxxl.click/me
Or visit in your browser: https://niyi-hnginternship-stage0project.pxxl.click/me

📦 Dependencies
express — Web framework

axios — HTTP client for external API calls

dotenv — Loads environment variables

cors — Enables cross-origin requests

express-rate-limit — Optional rate limiting

✅ Sample Response
json
{
  "status": "success",
  "user": {
    "email": "anjorinadeniyi1811@gmail.com",
    "name": "Adeniyi Anjorin",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-16T00:28:43.585Z",
  "fact": "Cats purr at a frequency that promotes healing."
}
📣 Author
Adeniyi Anjorin Backend Developer 📧 anjorinadeniyi1811@gmail.com