//Connects your existing import DuasPage from './pages/duas/DuasPage'; in src/router.jsx directly to DuasHome.jsx.

import React from 'react';
import DuasHome from './DuasHome';

export default function DuasPage(props) {
  return <DuasHome {...props}/>;
}