import React, { useEffect } from 'react';

const PlayerPage = () => {
    useEffect(() => {
        const homeIcon = document.querySelector('#homepage-icon');
        const playerIcon = document.querySelector('#music-player-icon');
        playerIcon && playerIcon.classList.add('active');
        if(homeIcon && homeIcon.classList.contains('active')) homeIcon.classList.remove('active'); 
    },[]);

    return (
        <div className="player-page">
            <h1>Player Page</h1>
        </div>
    );
}
 
export default PlayerPage;