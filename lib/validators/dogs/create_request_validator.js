'use strict';

class CreateRequestValidator
{
    constructor() {
        this.errors = [];
    }

    /**
     * @param {object} req - Express.js request object.
     *
     * @returns {boolean} - Is the request valid?
     */
    valid(req) {
        this.reset();

        const breed = req.body.breed;
        const name = req.body.name;

        if (!name) {
            this.errors.push('Name must be a non-empty string.');
        }
        if (!breed) {
            this.errors.push('Breed must be a non-empty string.');
        }

        return (this.errors.length === 0);
    }

    /**
     * @returns {Array} - Validation errors.
     */
    getErrors() {
        return this.errors;
    }

    reset() {
        this.errors = [];
    }
}

module.exports = CreateRequestValidator;
