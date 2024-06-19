import React, { useEffect, useState } from 'react';
import PlaylistsList from '../components/Homepage/PlaylistsList';
import TopArtistsList from '../components/Homepage/TopArtistsList';
import TopTracksList from '../components/Homepage/TopTracksList';
import { useSpotifyAPI } from '../hooks/useSpotifyAPI';

function HomePage() {
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
  }, []);

  return (
    <div className="home-page">
      <PlaylistsList playlistsList={playlistsList} />
      <TopArtistsList topArtists={topArtists} />
      <TopTracksList topTracks={topTracks} />
    </div>
  );
}

export default HomePage;