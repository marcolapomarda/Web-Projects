const TopTracksList = (props) => {
    const tracks = props.topTracks.items;

    return (
        <div className="top-tracks">
            <h2>Top Tracks:</h2>
            {/* <p>{ props.topTracks }</p> */}
            {tracks && tracks.map(track =>(
                <p key={track.id}>{track.name}</p>
            ))}
        </div>
    );
}
 
export default TopTracksList;