const TopTracksList = (props) => {
    const tracks = props.topTracks.items;

    const handleSetActiveHeart = (e) => {
        if(!e.target.classList.contains('active')) {
            e.target.classList.add('active');
        } else {
            e.target.classList.remove('active');
        }
    };

    return (
        <div className="top-tracks">
            <h2>Top Tracks</h2>
            <div className="tracks-wrapper">
                {tracks && tracks.map(track =>(
                    <div className="track-container" key={track.id}>
                        <img src={track.album.images[0].url} alt={track.name} />
                        <div className="track-title">
                            <p className="title">{track.name}</p>
                            <p className="artists">{track.artists.map(artist => artist.name).join(', ')}</p>
                        </div>
                        <p className="track-duration">
                            {Math.floor((track.duration_ms / 1000) / 60)}
                            :
                            {
                                (Math.floor((track.duration_ms / 1000)) - Math.floor((track.duration_ms / 1000) / 60) * 60) < 10 ?
                                '0' + (Math.floor((track.duration_ms / 1000)) - Math.floor((track.duration_ms / 1000) / 60) * 60) :
                                (Math.floor((track.duration_ms / 1000)) - Math.floor((track.duration_ms / 1000) / 60) * 60)
                            }
                        </p>
                        <i 
                          className="fa-regular fa-heart"
                          onClick={(e) => handleSetActiveHeart(e)}
                        ></i>
                        <i className="fa-solid fa-ellipsis"></i>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default TopTracksList;