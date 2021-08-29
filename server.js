const express = require('express')
const app = express();
const path = require('path');

app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.listen(3000, () => {
  console.log('Server running at port 3000');
});
