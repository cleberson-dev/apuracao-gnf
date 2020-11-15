const express = require('express');
const cors = require('cors');
const db = require('./db');
const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());


app.get('/candidatos', async (req, res) => {
    const candidates = await db('candidate');

    res.status(200);
    return res.send(candidates);
});

app.get('/secoes', async (req, res) => {
    let sections = await db('section');
    sections = await Promise.all(sections.map(async (section) => {
        let sectionVotes = await db('vote').where({ numero_secao: section.num });
        let votos = {};
        sectionVotes.forEach(sv => {
            const key = sv.numero_candidato != 0 ? sv.numero_candidato : 'outros';
            votos[key] = sv.votos;
        });

        return {
            num: section.num,
            local: section.local,
            eleitores: section.eleitores,
            zona: section.zona.toLowerCase(),
            closed: section.totalizada === 0 ? false : true,
            votos
        };
    }));

    res.status(200);
    return res.send(sections);
});

app.patch('/secoes/:numSecao/votos', async (req, res) => {
    const { numSecao } = req.params;
    const { votos } = req.body;

    try {
        for (const numCandidato in votos) {
            await db('vote')
                .where('numero_candidato', Number(numCandidato))
                .where('numero_secao', Number(numSecao))
                .update('votos', votos[numCandidato]);

            }
            db('vote').then(res => console.log(res.length));


        await db('section')
            .where('num', Number(numSecao))
            .update('totalizada', true);
    } catch (err) {
        console.error(err);
        res.status(400);
        return res.send({ success: false });
    }

    res.status(200);
    return res.send({ success: true });
});

app.get('/votos', async (req, res) => {
    const votes = await db('vote');

    res.status(200);
    return res.send(votes);
});

app.post('/votos', async (req, res) => {
    const { numSecao, numCandidato, votos } = req.body;
    const newVote = await db('vote').insert({
        numero_secao: numSecao,
        numero_candidato: numCandidato,
        votos: votos || 0
    });
    res.status(201);
    return res.send({ success: true, data: newVote });
});

app.get('/limparVotos', async (req, res) => {
    try {
        const votes = [];
        await db('vote').del();
        const sections = await db('section');
        const candidates = await db('candidate');
        sections.forEach(s => {
            candidates.forEach(c => {
                votes.push({
                    numero_secao: s.num,
                    numero_candidato: c.numero,
                    votos: 0
                });
            });
        });
        console.log(votes.length);
        await Promise.all(votes.map(v => db('vote').insert(v)));
        await db('vote').update('votos', 0);
        await db('section').update('totalizada', false);
        res.status(200);
        return res.send({ success: true });
    } catch (err) {
        console.error(err);
        res.status(400);
        return res.send({ success: false });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))