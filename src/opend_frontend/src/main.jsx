import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Principal } from '@dfinity/principal';

const CURRENT_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
