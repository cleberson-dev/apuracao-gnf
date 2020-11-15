const axios = require('axios');
const db = require('./db');

module.exports = {
    async clean() {
        let sections;
        let candidates;
        let votes = [];

        await db('vote').del();
        await db('section').update('totalizada', 0);

        return db('section')
            .then(data => {
                sections = data;
                return db('candidate');
            })
            .then(data => {
                candidates = data;

                sections.forEach(s => {
                    candidates.forEach(c => {
                        votes.push({
                            numSecao: s.num,
                            numCandidato: c.numero,
                            votes: 0
                        });
                    });
                });

                return Promise.all(votes.map(v => axios.post('http://localhost:5000/votos', v)))
            });
    }
}