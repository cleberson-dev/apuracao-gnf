const axios = require('axios');
const db = require('./db');

let sections;
let candidates;
let votes = [];

// axios.delete('http://localhost:5000/votos')
// .then((res) => console.log(res.data));

axios.get('http://localhost:5000/candidatos')
    .then(res => {
        console.log(res.data);
    })
