// Appel d'express : pour créer le routeur
const express = require('express');

// Créer un routeur avec la méthode Router d'express
const router = express.Router();

// Appel le middleware d'authentification qui protège les routes
const auth = require('../middleware/auth');

// Appel muter pour l'ajout d'images
const multer = require('../middleware/multer-config');

// Import de la logique des routes
const saucesCtrl = require('../controllers/sauces');

// Intercepter les différentes requêtes
router.get('/', auth, saucesCtrl.getAllSauce);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeDislikeSauce);

// Exporter le routeur
module.exports = router;