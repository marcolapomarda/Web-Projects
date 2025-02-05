const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const router = express.Router();
const config = require('../config');

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  CLIENT_URL
} = config;

let accessToken = '';
let refreshToken = '';
let tokenExpiryTime = 0; // Unix time when the token expires

const generateRandomString = (length) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
  
const stateKey = 'spotify_auth_state';
  
router.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    const scope = 'user-read-private user-read-email user-top-read user-library-read playlist-read-private';
    const queryParams = querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state
    });
  
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});
  
router.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect('/login?error=state_mismatch');
    } else {
      res.clearCookie(stateKey);
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
          code: code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          grant_type: 'authorization_code'
        }), {
          headers: {
            'Authorization': 'Basic ' + (Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);
  
        const redirectUri = `${CLIENT_URL}/callback#` +
        querystring.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: response.data.expires_in
        });

      res.redirect(redirectUri);
      } catch (error) {
        console.error('Error during authorization code exchange:', error);
        res.redirect('/login?error=invalid_token');
      }
    }
});
  
const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }), {
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    accessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + (response.data.expires_in * 1000);

    // Only update the refresh token if a new one is returned
    if (response.data.refresh_token) {
        refreshToken = response.data.refresh_token;
    }

    return response.data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
    }
};
  
const ensureAccessToken = async () => {
    if (!accessToken || Date.now() >= tokenExpiryTime) {
      await refreshAccessToken();
    }
};
  
router.use(async (req, res, next) => {
    try {
      await ensureAccessToken();
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to refresh access token' });
    }
});
  
router.get('/playlists', async (req, res) => {
    try {
      await ensureAccessToken();
      const response = await axios.get('https://api.spotify.com/v1/me/playlists?limit=10&offset=0', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
    });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching user\'s playlists:', error);
      res.status(500).json({ error: 'Failed to fetch user\'s playlists' });
    }
});
  
router.get('/top-artists', async (req, res) => {
    try {
      await ensureAccessToken();
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10&offset=0', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
    });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching user\'s top artists:', error);
      res.status(500).json({ error: 'Failed to fetch user\'s top artists' });
    }
});
  
router.get('/top-tracks', async (req, res) => {
    try {
      await ensureAccessToken();
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=20&offset=0', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
    });
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching user\'s top tracks:', error);
      res.status(500).json({ error: 'Failed to fetch user\'s top tracks' });
    }
});

router.get('/refresh_token', async (req, res) => {
    const refreshTokenParam = req.query.refresh_token; // Assuming you are passing the refresh token as a query parameter

    if (!refreshTokenParam) {
        return res.status(400).send('Refresh token is required');
    }

    try {
        refreshToken = refreshTokenParam; // Update the stored refresh token
        const data = await refreshAccessToken();
        res.json(data);
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).send('Failed to refresh token');
    }
});

module.exports = router;
