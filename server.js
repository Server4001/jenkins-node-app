'use strict';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const reqPropsMiddleware = require('./lib/middleware/request_properties');

// Load config file.
const config = require('./config/config.json');

// Create application object.
const app = express();

// Add config to app container.
app.set('config.json', config);

// MongoDB.
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);

const mongodb = mongoose.connection;
mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set view engine.
app.set('view engine', 'pug');

// Allow params in URIs, and parsing request body into JSON.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Additional middleware.
app.use(reqPropsMiddleware);

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
