import React from 'react';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/spotify/login';
  };

  return (
    <div className="login-page">
      <h1>Login to Spotify</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;