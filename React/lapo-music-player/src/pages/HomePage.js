import React, { useEffect, useState } from 'react';
import PlaylistsList from '../components/Homepage/PlaylistsList';
import TopArtistsList from '../components/Homepage/TopArtistsList';
import TopTracksList from '../components/Homepage/TopTracksList';
import { useSpotifyAPI } from '../hooks/useSpotifyAPI';

const HomePage = () => {
  const { getUserPlaylists, getTopArtists, getTopTracks } = useSpotifyAPI();
  const [playlistsList, setPlaylistsList] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const playlists = await getUserPlaylists();
      const artists = await getTopArtists();
      const tracks = await getTopTracks();
      setPlaylistsList(playlists);
      setTopArtists(artists);
      setTopTracks(tracks);
    }
    fetchData();

    const homeIcon = document.querySelector('#homepage-icon');
    const playerIcon = document.querySelector('#music-player-icon');
    homeIcon && homeIcon.classList.add('active');
    if(playerIcon && playerIcon.classList.contains('active')) playerIcon.classList.remove('active');
  }, []);

  return (
    <div className="home-page">
      <PlaylistsList playlistsList={playlistsList} />
      <TopTracksList topTracks={topTracks} />
      <TopArtistsList topArtists={topArtists} />
    </div>
  );
}

export default HomePage;