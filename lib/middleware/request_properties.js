'use strict';

module.exports = (req, res, next) => {
    req.urlBase = `${req.protocol}://${req.get('host')}`;
    req.urlFull = `${req.urlBase}${req.originalUrl}`;

    next();
};
