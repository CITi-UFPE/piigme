// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path');

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
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ==================== FUNCTIONS ==================== //

// returns the full path of the passed view
const getViewPath = view => path.join(__dirname, `views/${view}/${view}.html`);

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
  res.sendFile(getViewPath('home'));
});

app.get('/links', (req, res) => { // create view links
  res.sendFile(getViewPath('links'));
});

app.get('/contributors', (req, res) => {
  res.sendFile(getViewPath('contributors'));
});

// ==================== POST REQUESTS ==================== //

app.post('/', (req, res) => { // save original and custom link on firebase
  const original_link = req.body.original_link;
  const custom_link = req.body.custom_link;
  db.ref(`/links/${custom_link}`).set({
    original_link,
    clicks: 0
  }, (error) => {
    if (error) {
      res.send('DB Error: ', error);
      return;
    }
  });

  res.sendFile(getViewPath('home'));
});

// ==================== API REQUESTS ==================== //

app.get('/api/get_links', (req, res) => { // middleware function
  const links = [];
  db.ref('/links').once('value')
    .then((snapshot) => {
      snapshot.forEach((snap) => { // get db links
        links.push({ // add links to array
          key: snap.key,
          original_link: snap.val().original_link,
          clicks: snap.val().clicks,
        });
      });
      res.send(JSON.stringify(links)); // parse object in JSON type
    })
    .catch((error) => {
      console.log('Error:', error);
    });
});

// ==================== REDIRECT ROUTES ==================== //

app.get('*', (req, res) => { // treat all the url requests but the above ones
  matchFlag = false;

  if (req.url === '/favicon.ico') return;

  // redirect all the requests to it's correspondent links
  db.ref('/links').once('value').then((snapshot) => {
    snapshot.forEach((snap) => {
      if (snap.key === req.url.slice(1)) {
        matchFlag = true;
        db.ref(`/links/${snap.key}`).update({
          clicks: +snap.val().clicks + 1, // keep count of the link accesses
        }, (error) => {
          res.redirect(snap.val().original_link);
        });
      }
    });

    if(!matchFlag) res.sendFile(getViewPath('404'));
  });
});

// TODO: change post to ajax

// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
  console.log('READY');
});

// ====================================================== //