// Appel d'express
const express = require('express');

// Appel du routeur
const router = express.Router();

// Import de la logique des routes
const userCtrl = require('../controllers/user');

// Intercepter les différentes requêtes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporter le routeur
module.exports = router;