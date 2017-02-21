'use strict';

const express = require('express');
const router = express.Router();
const Dog = require('../../models/dog');
const CreateRequestValidator = require('../../lib/validators/dogs/create_request_validator');

module.exports = (app) => {

    // GET / - List.
    router.get('/', (req, res) => {

        // Find all dogs.
        Dog.find((err, dogs) => {

            if (err) {
                console.error(err);

                res.status(500);
                res.json({
                    status: 'error',
                    data: {
                        message: 'Unable to find all dogs. ' + err,
                    },
                });

                return;
            }

            res.json({
                status: 'success',
                data: {
                    dogs,
                },
            });
        });
    });

    // POST / - Create.
    router.post('/', function(req, res) {
        let validator = new CreateRequestValidator();
        const breed = req.body.breed;
        const name = req.body.name;

        if (!validator.valid(req)) {
            res.status(400);
            res.json({
                status: 'fail',
                data: {
                    errors: validator.getErrors(),
                },
            });

            return;
        }

        // Create the dog.
        const dog = new Dog({
            name,
            breed,
        });

        dog.save((err) => {
            if (err) {
                console.error(err);

                res.status(500);
                res.json({
                    status: 'error',
                    data: {
                        message: 'Unable to save dog to MongoDB. ' + err,
                    },
                });

                return;
            }

            res.json({
                status: 'success',
                data: {
                    dog_id: dog.id,
                },
            });
        });
    });

    return router;
};

