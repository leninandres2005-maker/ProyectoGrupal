import React, { useState } from 'react';
import './login-card.css';

function UserLogin() {
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  return (
    <div className="login">
      <h2>Login</h2>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" required />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default UserLogin;