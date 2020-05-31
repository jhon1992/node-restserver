require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (error, res) => {
        if (error) throw error;

        console.log('Base de datos Online');
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});