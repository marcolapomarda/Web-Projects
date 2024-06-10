import config from "./config.js";

// API Module
const APIController = (() => {

    const clientId = config.CLIENT_ID;
    const clientSecret = config.CLIENT_SECRET;

    //private methods
    const _getToken = async () => {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        if (!result.ok) {
            throw new Error('Failed to fetch token');
        }
        
        const data = await result.json();
        return data.access_token;
    }

    /* <<< Can't retrieve User data using client_credentials auth flow >>>

    const _getCurrentUser = async (token) => {
        const result = await fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }
    */

    const _getCategories = async (token) => {
        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=en_US', {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistsByCategory = async (token, categoryId) => {
        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token }
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getCategories(token) {
            return _getCategories(token);
        },
        getPlaylistsByCategory(token, categoryId) {
            return _getPlaylistsByCategory(token, categoryId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }

})();


// UI Module
const UIController = (() => {

    //object holding ref to HTML selectors
    const DOMElements = {
        selectCategory: '#select_category',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSongList: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputFields() {
            return {
                category: document.querySelector(DOMElements.selectCategory),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                songs: document.querySelector(DOMElements.divSongList),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail), 
            }
        },

        //methods to create select's list option
        createCategory(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            this.inputFields().category.insertAdjacentHTML('beforeend', html);
        },
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            this.inputFields().playlist.insertAdjacentHTML('beforeend', html);
        },

        //method to create a track list group item
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            this.inputFields().songs.insertAdjacentHTML('beforeend', html);
        },

        //method to create the selected song's detail
        createTrackDetail(img, title, artist) {
            const detailDiv = this.inputFields().songDetail;
            //reset song detail div contet each time the user selects a new song
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="${title}">
            </div>
            <div class="row col-sm-12 px-0">
                <label for="" class="form-label col-sm-12">${title}</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="" class="form-label col-sm-12">By: ${artist}</label>
            </div>
            `;

            detailDiv.insertAdjacentHTML('beforeend', html);
        },

        //reset methods
        resetTrackDetail() {
            this.inputFields().songDetail.innerHTML = '';
        },
        resetTracks() {
            this.inputFields().songs.innerHTML = '';
            this.resetTrackDetail();
        },
        resetPlaylist() {
            this.inputFields().playlist.innerHTML = '';
            this.resetTracks();
        },

        //token methods
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }

    }

})();

// Application Module
const APPController = ((APICtrl, UICtrl) => {

    //getting input field refs
    const DOMInputs = UICtrl.inputFields();

    //getting categories on page load
    const loadCategories = async () => {
        const token = await APICtrl.getToken();
        //storing token into the page so we don't need to keep calling the API for a new one
        UICtrl.storeToken(token);
        const categories = await APICtrl.getCategories(token);
        //populating the categories select element
        categories.forEach(el => UICtrl.createCategory(el.name, el.id));
    }

    //category change event listener
    DOMInputs.category.addEventListener('change', async () => {
        //reset playlists when user changes category
        UICtrl.resetPlaylist();
        //retrieving previously stored token
        const token = UICtrl.getStoredToken().token;
        //getting the category select
        const categorySelect = UICtrl.inputFields().category;
        //getting the selected category
        const categoryId = categorySelect.options[categorySelect.selectedIndex].value;
        //getting playlist data from Spotify API based on the selected category
        const playlist = await APICtrl.getPlaylistsByCategory(token, categoryId);
        //populating the playlist select element
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });

     //submit button click event listener
     DOMInputs.submit.addEventListener('click', async (e) => {
        //prevent page reset
        e.preventDefault();
        //clear tracks
        UICtrl.resetTracks();
        //getting the token
        const token = UICtrl.getStoredToken().token;        
        //getting the playlist field
        const playlistSelect = UICtrl.inputFields().playlist;
        //getting track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        //getting the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        //create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name));
        
    });

    //song selection click event listener
    DOMInputs.songs.addEventListener('click', async (e) => {
        //prevent page reset
        e.preventDefault();
        //clear eventual previously selected track
        UICtrl.resetTrackDetail();
        //getting the token
        const token = UICtrl.getStoredToken().token;
        //getting the track endpoint
        const trackEndpoint = e.target.id;
        //getting the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        //load the track details - defining an array for the artist as there might be more artists for a single song
        const artistsNameArray = [];
        const artistsArray = track.artists;
        artistsArray.forEach(el => {
            artistsNameArray.push(el.name);
        });
        const artistsString = artistsNameArray.join(', ');
        UICtrl.createTrackDetail(track.album.images[0].url, track.name, artistsString);
    });    

    return {
        init() {
            console.log('App is starting');
            loadCategories();
        }
    }

})(APIController, UIController);

APPController.init();