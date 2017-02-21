'use strict';

module.exports = function(app) {
    const express = require('express');
    const router = express.Router();

    // GET / - List
    router.get('/', function(req, res) {
        res.json([
            {
                "url": "http://dev.cd-docker-ansible.loc/todos/9",
                "title": "Title goes here",
                "completed": false,
                "order": 4
            }, {
                "url": "http://dev.cd-docker-ansible.loc/todos/10",
                "title": "Walk the dog",
                "completed": false,
                "order": 3
            }
        ]);
    });

    return router;
};

