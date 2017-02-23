'use strict';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// Load config file.
const config = require('./config/config.json');

// Create application object.
const app = express();

// MongoDB.
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);

const mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set view engine.
app.set('view engine', 'pug');

// Allow for parsing request body into JSON.
app.use(bodyParser.json());

// Add CORS.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

// Disable the "x-powered-by: Express" header.
app.set('x-powered-by', false);

// Set up routes.
const dogsV1Router = require(path.join(__dirname, '/routes/dogs/v1'))(app);
const indexRouter = require(path.join(__dirname, '/routes/index'))(app);

app.use('/dogs/v1', dogsV1Router);
app.use('/', indexRouter);

// Boot up server.
const server = app.listen(config.port, function(err) {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        console.log(`Server started on port ${server.address().port}.`);
    }
});
