const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>Lapo's Muay Thai Blog</h1>
            <div className="links">
                <a href="/">Home</a>
                <a href="/create" id="create-blog">New Blog</a>
            </div>
        </nav>
     );
}
 
export default Navbar;