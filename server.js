const express = require('express')
const app = express();
const path = require('path');

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/404', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/404.html'));
});

app.get('/colaborators', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/colaborators.html'));
});

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
