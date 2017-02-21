'use strict';

const express = require('express');

const config = require('./config/config.json');

const app = express();
app.set('config', config);

const dogsV1Router = require('./routes/dogs/v1')(app);

app.use('/dogs/v1', dogsV1Router);

const server = app.listen(config.port, function(err) {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        console.log(`Server started on port ${server.address().port}.`);
    }
});
