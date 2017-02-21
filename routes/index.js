'use strict';

const express = require('express');
const router = express.Router();
const Dog = require('../models/dog');

module.exports = (app) => {

    // GET / - Index page.
    router.get('/', (req, res) => {

        // Find all dogs.
        Dog.find((err, dogs) => {

            if (err) {
                console.error(err);

                res.status(500);
                res.send(err);

                return;
            }

            res.render('index', {
                dogs,
                title: 'Jenkins Node.js App',
            });
        });
    });

    return router;
};

