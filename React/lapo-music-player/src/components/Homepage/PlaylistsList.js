const PlaylistsList = (props) => {
    const playlists = props.playlistsList.items;

    return (
        <div className="playlists">
            <h2>Your Playlists</h2>
            <div className="playlists-wrapper">
                {playlists && playlists.map(playlist =>(
                    <div className="playlist-card" key={playlist.id}>
                        <img 
                        src={playlist.images[2] ? playlist.images[2].url : playlist.images[1] ? playlist.images[1].url : playlist.images[0].url} 
                        alt={playlist.name} 
                        />
                        <p>{playlist.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default PlaylistsList;