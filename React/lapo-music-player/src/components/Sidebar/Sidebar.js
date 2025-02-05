import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);

    const handleSetActive = (path) => {
        setActive(path);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-upper">
                <div className="sidebar-upper-g1">
                    <Link>
                        <i className="fa-brands fa-spotify" id="spotify-icon"></i>
                    </Link>
                </div>
                <div className="sidebar-upper-g2">
                    <Link
                      to = '/'
                      className = {active === '/' ? 'active' : ''}
                      onClick={() => handleSetActive('/')}
                    >
                        <i className="fa-solid fa-house" id="homepage-icon"></i>
                    </Link>
                    <Link
                      to = '/player'
                      className = {active === '/player' ? 'active' : ''}
                      onClick={() => handleSetActive('/player')}
                    >
                        <i className="fa-solid fa-music" id="music-player-icon"></i>
                    </Link>
                    <Link>
                        <i className="fa-regular fa-folder"></i>
                    </Link>
                    <Link>
                        <i className="fa-regular fa-user"></i>
                    </Link>
                </div>
            </div>
            <div className="sidebar-bottom">
                <Link>
                    <i className="fa-regular fa-heart"></i>
                </Link>
                <Link>
                    <i className="fa-solid fa-gear"></i>
                </Link>
            </div>
        </div>
    );
}
 
export default Sidebar;