'use strict';

const express = require('express');
const router = express.Router();
const Dog = require('../../models/dog');
const CreateRequestValidator = require('../../lib/validators/dogs/create_request_validator');
const jsendHelper = require('../../lib/helpers/jsend');

module.exports = (app) => {

    router.route('/')

        // GET /dogs/v1 - List Dogs.
        .get((req, res) => {

            // Find all dogs.
            Dog.find((err, dogs) => {

                if (err) {
                    console.error(err);
                    jsendHelper.error(res, { message: 'Unable to find all dogs. ' + err });

                    return;
                }

                jsendHelper.success(res, { dogs });
            });
        })

        // POST /dogs/v1 - Create Dog.
        .post((req, res) => {

            let validator = new CreateRequestValidator();
            const breed = req.body.breed;
            const name = req.body.name;

            // Validate POST payload.
            if (!validator.valid(req)) {
                jsendHelper.fail(res, { errors: validator.getErrors() });

                return;
            }

            // Create the dog.
            const dog = new Dog({ name, breed });

            dog.save((err) => {
                if (err) {
                    console.error(err);
                    jsendHelper.error(res, { message: 'Unable to save dog to database. ' + err });

                    return;
                }

                res.append('Location', `${req.urlFull}/${dog.id}`);
                jsendHelper.success(res, {}, 201);
            });
        });

    // Disable delete all dogs route in production environments.
    if (app.get('config.json').allow_delete_all_dogs) {

        // DELETE /dogs/v1 - Delete All Dogs.
        router.delete('/', (req, res) => {
            Dog.remove({}, (err) => {
                if (err) {
                    console.error(err);
                    jsendHelper.error(res, { message: 'Unable to delete all dogs. ' + err });

                    return;
                }

                jsendHelper.success(res, {});
            });
        });
    }

    router.route('/:dog_id')

        // GET /dogs/v1/:dog_id - Get Dog.
        .get((req, res) => {

            // Find the dog by id.
            Dog.findById(req.params.dog_id, (err, dog) => {
                if (err || dog === null) {
                    jsendHelper.fail(res, { message: 'Cannot find dog.' }, 404);

                    return;
                }

                jsendHelper.success(res, { dog });
            });
        })

        // PUT /dogs/v1/:dog_id - Update Dog.
        .put((req, res) => {

            // Find the dog by id.
            Dog.findById(req.params.dog_id, (err, dog) => {
                if (err) {
                    jsendHelper.fail(res, { message: 'Cannot find dog. ' + err }, 404);

                    return;
                }

                if (req.body.name) {
                    dog.name = req.body.name;
                }
                if (req.body.breed) {
                    dog.breed = req.body.breed;
                }

                dog.save((err) => {
                    if (err) {
                        console.error(err);
                        jsendHelper.error(res, { message: 'Unable to save dog to database. ' + err });

                        return;
                    }

                    jsendHelper.success(res, { dog });
                });
            });
        })

        // DELETE /dogs/v1/:dog_id - Remove Dog.
        .delete((req, res) => {
            Dog.remove({
                _id: req.params.dog_id
            }, (err, dog) => {
                if (err) {
                    jsendHelper.fail(res, { message: 'Unable to delete dog from database. ' + err }, 404);

                    return;
                }

                jsendHelper.success(res, {});
            });
        });

    return router;
};

