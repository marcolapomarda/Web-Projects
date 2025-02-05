const TopArtistsList = (props) => {
    const artists = props.topArtists.items;
    console.log(artists);

    return (
        <div className="top-artists">
            <h2>Top Artists</h2>
            <div className="artists-wrapper">
                {artists && artists.map(artist =>(
                    <div className="artist-container" key={artist.id}>
                        <img src={artist.images[0].url} alt={artist.name} />
                        <h3>{artist.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
 
export default TopArtistsList;