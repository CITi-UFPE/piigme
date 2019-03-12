// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect');
const exphbs = require('express-handlebars');

// ==================== FIREBASE CONFIG ==================== //

// TODO: Put apiKey in .env
firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "citily-1e28f.firebaseapp.com",
  databaseURL: "https://citily-1e28f.firebaseio.com",
  projectId: "citily-1e28f",
  storageBucket: "citily-1e28f.appspot.com",
  messagingSenderId: "206377299270"
});

// ==================== GLOBAL VARIABLES ==================== //

const app = express();
const db = firebase.database();
const specialLinks = ['links', '404', 'contributors'];
let waitingResponse = 0; // used to see how many requests are currently open

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

app.use(sslRedirect());

// serving static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ==================== FUNCTIONS ==================== //

const getLink = (req, res) => {
  if (req.url === '/favicon.ico') return;
  if (req.url === '/manifest.json') return;

  const link = req.url.split('?')[0].slice(1);

  if (specialLinks.indexOf(link) !== -1) {
    res.render(link);
    return;
  }

  // this part avoids the server to have more than 80 requests to firebase open at the same time
  // because the free account does not allow more than 100 simultaneous connections
  if (waitingResponse > 80) {
    setTimeout(() => {
      getLink(req, res);
    }, 100); // wait 100ms before trying again
    return;
  }

  waitingResponse++;

  // redirect all the requests to it's correspondent links
  db.ref(`/links/${link}`).once('value').then((snapshot) => {
    waitingResponse--;

    if (!snapshot.val()) {
      res.render('404');
      return;
    }

    db.ref(`/links/${link}`).update({
      clicks: +snapshot.val().clicks + 1, // keep count of the link accesses
    }, (error) => {
      if (error) {
        res.send('error');
        return;
      }

      const linkRedirect = snapshot.val().original_link;
      res.redirect(`${linkRedirect.indexOf('http') !== 0 ? 'http://' : ''}${linkRedirect}`);
    });
  });
}

// ==================== SETUP VIEWS ==================== //

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
  res.render('home');
});

// ==================== POST REQUESTS ==================== //

app.post('/', (req, res) => { // save original and custom link on firebase
  const original_link = req.body.original_link;
  const custom_link = req.body.custom_link;

  if (specialLinks.indexOf(custom_link) !== -1) {
    res.send('repeated');
    return;
  }

  if (original_link.indexOf('piig.me/') !== -1) {
    res.send('piig');
    return;
  }

  // check if custom_link already exists
  db.ref(`/links/${custom_link}`).once('value').then((snapshot) => {
    if (snapshot.val()) {
      res.send('repeated');
      return;
    }

    db.ref(`/links/${custom_link}`).set({
      original_link,
      clicks: 0
    }, (error) => {
      if (error) {
        res.send('error');
        return;
      }
    });

    res.send('ok');
  });

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
  getLink(req, res);
});

// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
  console.log('READY');
});

// ====================================================== //
