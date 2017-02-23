'use strict';

const expect = require('chai').expect;
const CreateRequestValidator = require('../../../../../lib/validators/dogs/create_request_validator');

describe('Create Dog Request Validator', () => {
    let validator;
    let req;

    before(() => {
        validator = new CreateRequestValidator();
        req = {
            body: {},
        };
    });

    describe('valid()', () => {
        it('should return false when name is missing', () => {
            req.body = {breed: 'test'};
            expect(validator.valid(req)).to.equal(false);
        });

        it('should return false when breed is missing', () => {
            req.body = {name: 'test'};
            expect(validator.valid(req)).to.equal(false);
        });

        it('should return false when name and breed are missing', () => {
            req.body = {};
            expect(validator.valid(req)).to.equal(false);
        });
    });

    describe('reset()', () => {
        it('executes between valid() runs', () => {
            req.body = {};

            expect(validator.valid(req)).to.equal(false);
            expect(validator.getErrors()).to.be.a('array');
            expect(validator.getErrors()).to.have.lengthOf(2);

            req.body.name = 'Patches';
            req.body.breed = 'Lab';

            expect(validator.valid(req)).to.equal(true);
            expect(validator.getErrors()).to.be.a('array');
            expect(validator.getErrors()).to.have.lengthOf(0);
        });
    });

    describe('getErrors()', () => {
        it('should contain name when name is invalid', () => {
            req.body = {
                name: '',
                breed: 'Mutt',
            };

            expect(validator.valid(req)).to.equal(false);
            expect(validator.getErrors()).to.be.a('array');
            expect(validator.getErrors()).to.include('Name must be a non-empty string.');
        });

        it('should contain breed when breed is invalid', () => {
            req.body = {
                name: 'Rufus',
                breed: '',
            };

            expect(validator.valid(req)).to.equal(false);
            expect(validator.getErrors()).to.be.a('array');
            expect(validator.getErrors()).to.include('Breed must be a non-empty string.');
        });
    });
});
