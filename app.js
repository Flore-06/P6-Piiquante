const express = require('express');
const mongoose = require('mongoose');

// Appel de app : notre application
const app = express();

// Appel de path : donne accès au chemin du système des fichiers
const path = require('path');

// Appel de helmet : permet de sécuriser les entêtes http
const helmet = require('helmet');

const cors = require('cors');

// Appel de dotenv : qui stocke des variables d'environnement
require('dotenv').config();

// Appel de rateLimit : limite la demande de l'utilisateur
//const rateLimit = require('express-rate-limit');

// Appel de hpp : middleware d'express qui protège contre les attaques de paramètres de pollution http
//const hpp = require('hpp');



// Appel des différentes routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connecter env à mongoose
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

/*app.use((req, res, next) => {
  res.status(201);
  next();
});*/

// CORS : définit comment les serveurs et navigateurs intéragissent : spécifie quelles ressources peuvent être demandées
app.use(cors());
//app.use(helmet());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    // ...
  })
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})


app.use(express.json());


//app.use(rateLimit());
//app.use(hpp());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;