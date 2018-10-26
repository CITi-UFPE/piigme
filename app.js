// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const firebase = require('firebase');

// ==================== FIREBASE CONFIG ==================== //

// TODO: Put apiKey in .env
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

app.post('/', (req, res) => { // save original and custom link on firebase
  const original_link = req.body.original_link;
  const custom_link = req.body.custom_link;
  db.ref(`/links/${custom_link}`).set( original_link, (error) => {
    if (error) {
      res.send('DB Error: ', error);
      return;
    }
  });

  res.sendFile(getViewPath('home'));
});

app.get('*', (req, res) => { // treat all the url requests but '/'
  linkFoundFlag = false;

  if(req.url === '/favicon.ico'){
    res.send('favicon'); // TODO: send favicon
    return;
  };

  // redirect all the requests to it's correspondent links
  db.ref('/links').once('value').then((snapshot) => {
    snapshot.forEach((snap) => {
      if(snap.key === req.url.slice(1)) res.redirect(snap.val());
    });
    if(!linkFoundFlag) res.send('not found page'); // TODO: link not found page
  });
});

// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
  console.log('READY');
});

// ====================================================== //