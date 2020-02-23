const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const debtRoutes = require('./routes/debtRoutes');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/debt', debtRoutes);

module.exports = app;