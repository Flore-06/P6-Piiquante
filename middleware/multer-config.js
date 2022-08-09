// Importer multer : permet de télécharger des fichiers
const multer = require('multer');

// Accepter les différents formats d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Enregistrer l'image sur le disque
const storage = multer.diskStorage({
  
  // Définir sa destination dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  // Renomme le fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});


// Exporter le fichier
module.exports = multer({storage: storage}).single('image');