const PlaylistsList = (props) => {
    const playlists = props.playlistsList.items;

    return (
        <div className="playlists">
            <h2>Playlists:</h2>
            {/* <p>{ props.playlistsList }</p> */}
            {playlists && playlists.map(playlist =>(
                <p key={playlist.id}>{playlist.name}</p>
            ))}
        </div>
    );
}
 
export default PlaylistsList;