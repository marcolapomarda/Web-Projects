const TopArtistsList = (props) => {
    const artists = props.topArtists.items;

    return (
        <div className="top-artists">
            <h2>Top Artists:</h2>
            {/* <p>{ props.topArtists }</p> */}
            {artists && artists.map(artist =>(
                <p key={artist.id}>{artist.name}</p>
            ))}
        </div>
    );
}
 
export default TopArtistsList;