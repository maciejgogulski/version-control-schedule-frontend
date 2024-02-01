import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import translationsEn from './translations/en.json';
import translationsPl from './translations/pl.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationsEn,
            },
            pl: {
                translation: translationsPl,
            },
        },
        lng: process.env.REACT_APP_LANGUAGE,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
