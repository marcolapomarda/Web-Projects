import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>Lapo's Muay Thai Blog</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/create" id="create-blog">New Blog</Link>
            </div>
        </nav>
    );
}
 
export default Navbar;