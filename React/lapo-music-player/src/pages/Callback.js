import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const expiresIn = parseInt(params.get('expires_in'), 10);
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // Calculate expiration time
      const expiresAt = (Date.now() / 1000) + expiresIn;

      // Store tokens and expiration time in local storage
      localStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_expires_at', expiresAt.toString());
      localStorage.setItem('spotify_refresh_token', refreshToken);

      // Redirect to home page or any other page
      navigate('/');
    }

  }, [navigate]);

  return null;
};

export default Callback;