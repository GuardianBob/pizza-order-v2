import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import reportWebVitals from './reportWebVitals';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===========IMPORTANT=============!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// To run backend mock-database, first fix the execution policy.  Run this command in terminal:
// set-ExecutionPolicy RemoteSigned -Scope CurrentUser 
// Then run this command to start server:
// ./node_modules/.bin/json-server-auth ./backend/db.json --port 3001

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
