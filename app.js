const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const logger = new (Winston.Logger) ({
  transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'application.log' })
  ],
  level: 'verbose'
});

var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();

// Schema properties
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Validate against a password string
console.log(schema.validate('validPASS123'));
// => true
console.log(schema.validate('invalidPASS'));
// => false

// Get a full list of rules which failed
console.log(schema.validate('joke', { list: true }));
// => [ 'min', 'uppercase', 'digits' ]


const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

app.use(express.json());
app.use(helmet());
app.use(rateLimit());
app.use(hpp());
app.use(logger());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;