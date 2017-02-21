'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Dog', new Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
}));
