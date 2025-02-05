const express = require('express');
const cors = require('cors');
const spotifyRoutes = require('./routes/spotify');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/spotify', spotifyRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));