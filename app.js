// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('firebase');

// ==================== FIREBASE CONFIG ==================== //

firebase.initializeApp({
  apiKey: "AIzaSyCeL6JxqXKNTsOM1DFHylKOxz4YE4K_trw",
  authDomain: "citily-1e28f.firebaseapp.com",
  databaseURL: "https://citily-1e28f.firebaseio.com",
  projectId: "citily-1e28f",
  storageBucket: "citily-1e28f.appspot.com",
  messagingSenderId: "206377299270"
});

// ==================== INTERNAL IMPORTS ==================== //

// ==================== GLOBAL VARIABLES ==================== //

const app = express();
const db = firebase.database();

// ==================== MIDDLEWARE ==================== //

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serving static files
app.use('/views', express.static(path.join(__dirname, 'views')));

// ==================== FUNCTIONS ==================== //

// returns the full path of the passed view
const getViewPath = view => path.join(__dirname, `views/${view}/${view}.html`);

// ==================== ROUTES ==================== //

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
  res.sendFile(getViewPath('home'));
});

// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
  console.log('READY');
});

db.ref('test').set('yay');

// ====================================================== //