const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-upper">
                <div className="sidebar-upper-g1">
                    <i className="fa-solid fa-record-vinyl" id="record-vinyl-icon"></i>
                </div>
                <div className="sidebar-upper-g2">
                    <i className="fa-solid fa-house" id="homepage-icon"></i>
                    <i className="fa-solid fa-music" id="music-player-icon"></i>
                    <i className="fa-regular fa-folder"></i>
                    <i className="fa-regular fa-user"></i>
                </div>
            </div>
            <div className="sidebar-bottom">
                <i className="fa-regular fa-heart"></i>
                <i className="fa-solid fa-gear"></i>
            </div>
        </div>
    );
}
 
export default Sidebar;