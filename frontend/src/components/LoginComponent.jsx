import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.error('Authentication failed 11111');
        return;
      }

      const data = await response.json();

      // Check the success property in the response
      if (data.success) {
        // Authentication successful, navigate to the next page
        console.log('Authentication successful');
        navigate(`/employees`);
      } else {
        // Authentication failed
        console.error('Authentication failed');
        // Handle authentication failure (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other errors (e.g., show an error message)
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;