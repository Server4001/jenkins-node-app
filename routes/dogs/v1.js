'use strict';

module.exports = function(app) {
    const express = require('express');
    const router = express.Router();

    // GET / - List
    router.get('/', function(req, res) {
        res.json([
            {
                "name": "Patches",
                "breed": "Dalmation",
                "created_at": "2017-01-02 12:13:14",
                "updated_at": "2017-01-02 12:13:14",
            }, {
                "name": "Bruce",
                "breed": "Mutt",
                "created_at": "2017-01-02 12:13:14",
                "updated_at": "2017-01-02 12:13:14",
            }
        ]);
    });

    return router;
};

