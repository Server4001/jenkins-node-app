'use strict';

const express = require('express');

const config = require('./config/config.json');

const app = express();
app.set('config', config);

const apiV1Router = require('./routes/api/v1')(app);

app.use('/api/v1', apiV1Router);

const server = app.listen(config.port, function(err) {
    if (err) {
        console.log(`ERROR: ${err}`);
    } else {
        console.log(`Server started on port ${server.address().port}.`);
    }
});
