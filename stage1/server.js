import express from 'express';
import stringRoutes from './routes/stringRoutes.js';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(cors())
app.use(express.json());

app.use('/',stringRoutes)

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => console.log(`Server is running on PORT: ${PORT}`) )