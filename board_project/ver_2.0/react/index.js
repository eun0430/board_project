import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie'; //모든 곳에서 쿠키 관리 가능

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <CookiesProvider>  {/* 쿠키 provider */}
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </CookiesProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();