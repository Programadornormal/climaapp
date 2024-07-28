import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();
const app = express();

const APICLIMA = process.env.APICLIMA;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/clima', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=sp&appid=${APICLIMA}`);
    const data = await response.json();
    res.json(data);
});
app.get('/ciudad/:ciudad', async(req, res)=>{
    try {
        const ciudad = req.params.ciudad;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=sp&appid=${APICLIMA}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Hubo un problema al obtener el clima.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
