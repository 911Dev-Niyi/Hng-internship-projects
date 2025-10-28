import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import countryRoutes from './routes/countryRoutes.js';
import { db } from './models/db.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/', countryRoutes);

const PORT = process.env.PORT || 3002;  

const startServer = async () => {
    await db; //wait for DB connection
    console.log('DB connection confirmed');
    app.listen(PORT, () =>  console.log(`Server running on port ${PORT}`));
};

startServer();