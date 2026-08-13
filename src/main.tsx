import React from 'react';import{createRoot}from'react-dom/client';import{BrowserRouter}from'react-router-dom';import App from'./App';import'./styles.css';import'./enhancements.css';import'./map-layout.css';import'./explorer-layout.css';import'./editorial-redesign.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>);
