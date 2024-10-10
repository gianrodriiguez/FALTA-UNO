const express = require('express');
const cors = require('cors');  // Import CORS
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());  // Enable CORS
app.use(express.json());

let matches = [];

app.post('/create-match', (req, res) => {
    const { teams, date, time } = req.body;
    if (teams.length !== 2) {
        return res.status(400).send('There must be two teams');
    }
    const newMatch = { id: matches.length + 1, teams, date, time, confirmed_players: [] };
    matches.push(newMatch);
    res.status(201).json(newMatch);
});

app.listen(3003, () => console.log('Match Service running on port 3003'));
