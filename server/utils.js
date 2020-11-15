const axios = require('axios');
const db = require('./db');

async function clean() {
    const votes = [];

    return db('vote');
}

clean().then(console.log);