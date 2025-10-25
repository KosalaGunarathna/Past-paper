import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navigater from './components/Navigater';

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <Navigater />
      <Outlet />
    </div>
  );
}
  

export default App;
