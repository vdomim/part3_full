import { createRoot } from 'react-dom/client';
import App from './App'
import React from 'react'
import './index.css'

createRoot(document.getElementById('root')).render(<App/>);

/*createRoot(document.getElementById('root')).render(<React.StrictMode>
    <App/>
  </React.StrictMode>);*/