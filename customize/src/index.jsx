import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';
import App from './components/App';
import './index.css';

moment.locale();
window.console.log(process.env.NODE_ENV);
render(
  <App />,
  document.getElementById('root'),
);
