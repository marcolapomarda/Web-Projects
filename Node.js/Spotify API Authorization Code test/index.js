require('dotenv').config();
const express = require('express');
const spotifyWebAPI = require('spotify-web-api-node');

const app = express();
const port = 3000;

const spotifyAPI = new spotifyWebAPI({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
});

app.get('/login', (req, res) => {
    const scopes = ['user-read-private','user-read-email','user-library-read','playlist-read-private','user-top-read'];
    res.redirect(spotifyAPI.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if(error) {
        console.error('Error: ', error);
        res.send(`Error: ${error}`);
        return;
    }

    spotifyAPI.authorizationCodeGrant(code).then(data => {
        const accessToken = data.body['access_token'];
        const refreshToken = data.body['refresh_token'];
        const expiresIn = data.body['expires_in'];

        spotifyAPI.setAccessToken(accessToken);
        spotifyAPI.setRefreshToken(refreshToken);
        
        //console.log(accessToken,refreshToken,expiresIn);
        res.send('Authorization succeded!');

        setInterval(async () => {
            const data = await spotifyAPI.refreshAccessToken();
            const accessTokenRefreshed = data.body['access_token'];
            spotifyAPI.setAccessToken(accessTokenRefreshed);
        }, expiresIn-300);
    }).catch(error => {
        console.error('Error: ', error);
        res.send(`Error getting auth token: ${error}`);
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});