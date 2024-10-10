const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');  // Import Mongoose
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURI = "mongodb://mongo:27017/faltaUnoDB";


mongoose.connect(mongoURI)
  .then(() => console.log("Team Service: MongoDB connected"),{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log(err));

// Define Team schema
const TeamSchema = new mongoose.Schema({
  team_name: String,
  players: [String]
});

const Team = mongoose.model('Team', TeamSchema);

// Create a new team
app.post('/create-team', async (req, res) => {
    const { team_name, players } = req.body;
    const newTeam = new Team({ team_name, players });
    await newTeam.save();
    res.status(201).json(newTeam);
});

// Get all teams
app.get('/teams', async (req, res) => {
    try {
      const teams = await Team.find();  // Fetch all teams from MongoDB
      res.json(teams);  // Return the teams as a JSON response
    } catch (error) {
      console.error("Error fetching teams:", error);  // Log the error for better debugging
      res.status(500).send('Error fetching teams');
    }
  });  

app.listen(3002, () => console.log('Team Service running on port 3002'));
