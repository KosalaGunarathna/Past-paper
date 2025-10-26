import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigater from './components/Navigater';

function App() {
  return (
    <div>
      <Navigater />
      <Outlet />
    </div>
  );
}
  

export default App;
