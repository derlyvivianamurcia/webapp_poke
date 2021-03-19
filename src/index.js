import React          from 'react';
import ReactDOM       from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App            from './routers/App';
import './styles/styles.css';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);

