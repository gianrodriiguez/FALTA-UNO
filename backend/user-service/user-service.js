const express = require('express');
const cors = require('cors');  // Import CORS
const mongoose = require('mongoose');  // Import mongoose
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors());  // Enable CORS
app.use(express.json());

// Connect to MongoDB Atlas
const mongoURI = "MONGO_URI=mongodb://mongo:27017/faltaUnoDB";

// // Connect to MongoDB Atlas
// mongoose.connect(mongoURI)
//   .then(() => console.log("User Service: MongoDB connected"))
//   .catch(err => console.log(err));

// < - - - - - - - - - - - - - - - - - - - - 

// const connectWithRetry = () => {
//   console.log('MongoDB connection with retry');
//   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log('MongoDB is connected');
//     })
//     .catch(err => {
//       console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', err);
//       setTimeout(connectWithRetry, 5000);  // Retry every 5 seconds
//     });
// };

// connectWithRetry();

// < - - - - - - - - - - - - - - - - - - - - 

mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


  
// Define a simple schema for players
const PlayerSchema = new mongoose.Schema({
    name: String,
    email: String
});

const Player = mongoose.model('Player', PlayerSchema);
 
// Register player
app.post('/register', async (req, res) => {
    const { name, email } = req.body;
    const newPlayer = new Player({ name, email });
    await newPlayer.save();
    res.status(201).json(newPlayer);
});

// Login player
app.post('/login', async (req, res) => {
    const { email } = req.body;
    const player = await Player.findOne({ email });
    if (player) {
        res.json(player);
    } else {
        res.status(401).send('Player not found');
    }
});

// Delete player by email
app.delete('/delete-player', async (req, res) => {
    const { email } = req.body;
    try {
      const deletedPlayer = await Player.findOneAndDelete({ email });
      if (deletedPlayer) {
        res.status(200).send(`Player with email ${email} was deleted`);
      } else {
        res.status(404).send('Player not found');
      }
    } catch (error) {
      res.status(500).send('Error deleting player');
      console.error(error);
    }
  });

  // Get all players
app.get('/players', async (req, res) => {
    try {
      const players = await Player.find();  // Fetch all players from MongoDB
      res.json(players);  // Return the players as a JSON response
    } catch (error) {
      res.status(500).send('Error fetching players');
      console.error(error);
    }
  });

app.listen(3001, () => console.log('User Service running on port 3001'));
