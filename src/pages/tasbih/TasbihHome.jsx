//Renders the Tasbih screen directly (ActiveTasbih) and passes the onBack callback so clicking the top-left ← button returns cleanly to the Home screen.

// src/pages/tasbih/TasbihHome.jsx
import React from 'react';
import ActiveTasbih from './ActiveTasbih';

export default function TasbihHome(props) {
  return <ActiveTasbih {...props} />;
}