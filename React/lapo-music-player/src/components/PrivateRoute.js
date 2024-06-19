import React from 'react';
import { Link } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('spotify_access_token');

    return isAuthenticated ? (
      <Component {...rest} />
    ) : (
      <div className='unauthorized'>
          <h2>You need to Login to see this page</h2>
          <Link to="/login">Login</Link>
      </div>
    );
  };
  
  export default PrivateRoute;