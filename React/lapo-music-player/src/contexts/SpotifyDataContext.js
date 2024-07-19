import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSpotifyAPI } from '../hooks/useSpotifyAPI';

const SpotifyDataContext = createContext();

export const SpotifyDataProvider = ({ children }) => {
  const { getUserPlaylists, getTopArtists, getTopTracks } = useSpotifyAPI();
  const [playlistsList, setPlaylistsList] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const playlists = await getUserPlaylists();
      const artists = await getTopArtists();
      const tracks = await getTopTracks();
      setPlaylistsList(playlists);
      setTopArtists(artists);
      setTopTracks(tracks);
      setDataFetched(true);
    }
    fetchData();
  }, []);

  return (
    <SpotifyDataContext.Provider value={{ playlistsList, topArtists, topTracks, dataFetched }}>
      {children}
    </SpotifyDataContext.Provider>
  );
};

export const useSpotifyData = () => useContext(SpotifyDataContext);
