// :: Project-wide setup steps
import axios from 'axios';

window.axios = axios;

const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/functions');


window.firebase = firebase;
const firebaseConfig = {
    apiKey: "AIzaSyBQZsQH7q7yQWztZByeDOWo6m9TiS9gpBg",
    authDomain: "eos-wizard.firebaseapp.com",
    databaseURL: "https://eos-wizard.firebaseio.com",
    projectId: "eos-wizard",
    storageBucket: "eos-wizard.appspot.com",
    messagingSenderId: "268258495028",
    appId: "1:268258495028:web:caf6c9fcfb0a574e"
};
window.firebaseApp = window.firebase.initializeApp(firebaseConfig);
