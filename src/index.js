import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { DOC_TITLE } from './config/app'

ReactDOM.render(<App />, document.getElementById('root'));
document.title = DOC_TITLE
registerServiceWorker();
