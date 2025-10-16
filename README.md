# 🚀 HNG Internship Stage 0 — Dynamic Profile Endpoint

This project is a simple RESTful API built for the HNG Internship Stage 0 backend task. It returns my profile information along with a dynamic cat fact fetched from an external API.

---

## 📌 Features

- GET `/me` endpoint
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
git clone https://github.com/yourusername/hng-stage0-profile-api.git
cd hng-stage0-profile-api
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
5. Test the Endpoint
🔹 Local Testing (before deployment)
bash
curl http://127.0.0.1:3000/me
🔹 Hosted Testing (after deployment)
Replace with your hosted URL:

bash
curl https://your-hosted-url.com/me
Or visit in your browser:

https://your-hosted-url.com/me
📦 Dependencies
express — Web framework

axios — HTTP client for external API calls

dotenv — Loads environment variables

cors — Enables cross-origin requests

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
```

📣 Author
Adeniyi Anjorin 
Backend Developer
📧 anjorinadeniyi1811@gmail.com