require('dotenv').config();

module.exports = {
  SPOTIFY_CLIENT_ID: process.env.CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: process.env.REDIRECT_URI,
  CLIENT_URL: process.env.CLIENT_URL
};