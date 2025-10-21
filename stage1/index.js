import express from 'express';
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Stage1 API is running');
})

const PORT = process.env.PORT || 3001;
app.listen(PORT,() => console.log(`Server is running on PORT: ${PORT}`) )