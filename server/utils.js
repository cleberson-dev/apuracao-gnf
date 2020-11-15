const axios = require('axios');
const db = require('./db');

async function clean() {
    const votes = [];

    return db('vote');
}

module.exports = { clean }

// clean().then(console.log);