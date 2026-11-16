//Connects your existing import HomePage from './pages/home/HomePage'; in src/router.jsx directly to Home.jsx.

import React from 'react';
import Home from './Home';

export default function HomePage(props) {
  return <Home {...props} />;
}