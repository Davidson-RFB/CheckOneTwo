import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App
  fetch={async path => {
    const result = await fetch(path);
    if (result.status === 200) {
      return {
        data: await result.json()
      }
    }
    return {
      error: result.statusText,
    }
  }}
  />, document.getElementById('root'));
registerServiceWorker();
