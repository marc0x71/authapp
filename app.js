const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const config = require('./config/database');

const app = express();

// port number
const port = 3000;

mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
  console.log("Connected on database " + config.database);
});
mongoose.connection.on('error', (err) => {
  console.log("Database error: " + err);
});

// CORS
app.use(cors());

// client
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(bodyParser.json());

// passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// routes
app.use('/users', users);

// index
app.get('/', (req, res) => {
  res.send('Invalid endpoint');
});

app.get('*', (req, res) => {
  console.log('undefined link');
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// start server
app.listen(port, () => {
  console.log('Server running on port ' + port);
})
