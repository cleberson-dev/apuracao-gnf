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

// db('section')
//     .then(data => {
//         sections = data;
//         return db('candidate');
//     })
//     .then(data => {
//         candidates = data;

//         sections.forEach(s => {
//             candidates.forEach(c => {
//                 votes.push({
//                     numSecao: s.num,
//                     numCandidato: c.numero,
//                     votes: 0
//                 });
//             });
//         });

//         return Promise.all(votes.map(v => axios.post('http://localhost:5000/votos', v)))
//     })
//     .then(res => {
//         console.log(res)
//         return axios.get('http://localhost:5000/votos');
//     })
//     .then(({ data }) => console.log(data))
//     .catch(console.error);