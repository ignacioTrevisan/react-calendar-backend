const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


//crear servidor de express
const app = express();

//base de datos

dbConnection();


//rutas


//directorio publico

app.use(express.static('public'));

//lectura y parse de peticiones

app.use(express.json());

app.use(cors());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Escucha peticiones

app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
})