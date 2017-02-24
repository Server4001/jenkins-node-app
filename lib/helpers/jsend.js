'use strict';

module.exports = (function() {

    /**
     * Generate a JSend response.
     *
     * @param {object} res - Express.js response object.
     * @param {String} status - Status node in response body.
     * @param {object} data - Data node in response body.
     * @param {Number} code - Response code.
     *
     * @returns {object} - Express.js response object.
     *
     * @private
     */
    const _generateResponse = (res, status, data, code) => {
        res.status(code);
        res.json({
            status,
            data
        });

        return res;
    };

    /**
     * An object used to help with JSend responses.
     */
    return {

        /**
         * Generate a JSend error response.
         *
         * @param {object} res - Express.js response object.
         * @param {object} data - Data node in response body.
         * @param {Number} code - Response code.
         *
         * @returns {object} - Express.js response object.
         */
        error(res, data = {}, code = 500) {
            return _generateResponse(res, 'error', data, code);
        },

        /**
         * Generate a JSend fail response.
         *
         * @param {object} res - Express.js response object.
         * @param {object} data - Data node in response body.
         * @param {Number} code - Response code.
         *
         * @returns {object} - Express.js response object.
         */
        fail(res, data = {}, code = 400) {
            return _generateResponse(res, 'fail', data, code);
        },

        /**
         * Generate a JSend success response.
         *
         * @param {object} res - Express.js response object.
         * @param {object} data - Data node in response body.
         * @param {Number} code - Response code.
         *
         * @returns {object} - Express.js response object.
         */
        success(res, data = {}, code = 200) {
            return _generateResponse(res, 'success', data, code);
        }
    };
})();
