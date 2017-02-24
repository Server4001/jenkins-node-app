'use strict';

const chai = require('chai');
// const should = chai.should;
const expect = chai.expect;
const Promise = require('bluebird');
const request = require('superagent-promise')(require('superagent'), Promise);
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// Load config file.
const config = require('../../../../config/config.json');
const url = config.dogs_api_base + '/dogs/v1';

if (url === undefined) {
    throw Error('Missing dogs_api_base in config file.');
}

const dog = {
    name: 'Rufus',
    breed: 'Beagle'
};

describe('Dogs v1 API integration tests', () => {

    describe('Cross Origin Requests', () => {
        let result;

        before(() => {
            result = request('OPTIONS', url)
                .set('Origin', 'http://someplace.com')
                .end();
        });

        it('should return the correct CORS headers', () => {
            return assert(result, 'header').to.contain.all.keys([
                'access-control-allow-origin',
                'access-control-allow-methods',
                'access-control-allow-headers'
            ]);
        });

        it('should allow all origins', () => assert(result, 'header.access-control-allow-origin').to.equal('*'));
    });

    describe('Create Dog', () => {
        let result;
        let deleteUrl;

        before(() => {
            result = post(url, dog);

            result.then((res) => {
                deleteUrl = res.header.location;
            })
        });

        it('should return a 201 CREATED response', () => assert(result, 'status').to.equal(201));

        it('should receive a location hyperlink', () => {
            return assert(result, 'header.location').to.match(/^https?:\/\/.+\/dogs\/v1\/[\da-f]+$/);
        });

        it('should create the dog', () => {
            const res = result.then((res) => {
                return get(res.header['location']);
            });

            assert(res, 'body.data.dog.name').that.equals(dog.name);

            return assert(res, 'body.data.dog.breed').that.equals(dog.breed);
        });

        // NOTE: The only reason this works is because this is called in the after() method.
        after(() => del(deleteUrl));
    });

    describe('Update Dog', () => {
        let location;
        const newName = 'Sgt. Barkley';

        beforeEach((done) => {
            post(url, dog).then((res) => {
                location = res.header['location'];
                done();
            });
        });

        it('should have a different name set after PUT update', () => {
            const result = update(location, 'PUT', { 'name': newName });

            return assert(result, 'body.data.dog.name').that.equals(newName);
        });

        it('should have a different name set after PATCH update', () => {
            const result = update(location, 'PATCH', { 'name': newName });

            return assert(result, 'body.data.dog.name').that.equals(newName);
        });

        afterEach(() => del(location));
    });

    describe('Delete Dog', () => {
        let location;

        beforeEach((done) => {
            post(url, dog).then((res) => {
                location = res.header['location'];
                done();
            });
        });

        it('should return a 204 NO CONTENT response', () => {
            const result = del(location);

            return assert(result, 'status').to.equal(204);
        });

        it('should delete the item', () => {
            const result = del(location).then(() => get(location));

            return expect(result).to.eventually.be.rejectedWith('Not Found');
        });
    });
});

/*
 * Convenience functions
 */

// Resolve promise for property and return expectation
function assert(result, prop) {
    return expect(result).to.eventually.have.deep.property(prop)
}

// GET request and return promise
function get(url) {
    return request.get(url)
        .set('Accept', 'application/json')
        .end();
}

// POST request with data and return promise
function post(url, data) {
    return request.post(url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data)
        .end();
}

// UPDATE request with data and return promise
function update(url, method, data) {
    return request(method, url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(data)
        .end();
}

// DELETE request and return promise
function del(url) {
    return request.del(url).end();
}
