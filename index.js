import express from 'express';
import axios from 'axios';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

import dotenv from 'dotenv';

dotenv.config();
const limiter = rateLimit({
    windowMs: 60 * 1000 ,// 1 minute
    max: 10,
    message: "Too many requests, please try again in 10 minutes"
})

const app = express();
app.use(cors());

app.get('/', limiter, (req, res) => {
    res.status(200).send({ message: 'Alive and healthy, visit /me to view profile information'})
})
app.get('/me', limiter, async (req, res) => {
    try {
        const catRes = await axios.get('https://catfact.ninja/fact', { timeout: 5000 });
        const catFact = catRes.data.fact;

        res.status(200).json({
            status: "successs",
            user: {
                name: process.env.MY_NAME,
                email: process.env.MY_EMAIL,
                stack: process.env.MY_STACK
            },
            timestamp: new Date().toISOString(),
            fact: catFact
        });
    } catch (err) {
        console.error("Cat fact API Error:", err.message)
        res.status(502).json({
            status: "success",
            user: {
                name: process.env.MY_NAME,
                email: process.env.MY_EMAIL,
                stack: process.env.MY_STACK
            },
            timestamp: new Date().toISOString(),
            fact: "Could not fetch cat fact. Please try again later"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running away on port ${PORT}`));