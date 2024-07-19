import React from 'react';
import PlaylistsList from '../components/Homepage/PlaylistsList';
import TopArtistsList from '../components/Homepage/TopArtistsList';
import TopTracksList from '../components/Homepage/TopTracksList';
import { useSpotifyData } from '../contexts/SpotifyDataContext';

const HomePage = () => {
  const { playlistsList, topArtists, topTracks, dataFetched } = useSpotifyData();

  if (!dataFetched) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-page">
      <PlaylistsList playlistsList={playlistsList} />
      <TopTracksList topTracks={topTracks} />
      <TopArtistsList topArtists={topArtists} />
    </div>
  );
}

export default HomePage;