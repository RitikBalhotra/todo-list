import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Dummy from './Dummy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Dummy/> */}
  </React.StrictMode>
);

