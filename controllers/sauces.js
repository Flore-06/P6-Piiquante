// Appel du modèle de la sauce
const Sauce = require("../models/Sauce");
// Appel du fs (filesystem) qui permet d'aller dans les fichiers
const fs = require('fs');


// Accéder à toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then((sauces) => { res.status(200).json(sauces);})
      .catch((error) => res.status(400).json({ error }));
};

// Accéder à une sauce particulière
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => { res.status(200).json(sauce);})
      .catch((error) => res.status(400).json({ error }));
};

// Créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  console.log(sauceObject);
  console.log(req.body);
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [' '],
      usersdisLiked: [' '],
  });

  // enregistrer la nouvelle sauce
  sauce.save()
  .then(() => { res.status(201).json({message: 'Sauce enregistrée !'})})
  .catch(error => { res.status(400).json( { error })})
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          // N'est pas autorisé à modifier si id du user est différent de celui qui a créé la sauce
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } 
          // Si id est le même : peut modifier
          else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          // N'est pas autorisé à supprimer si id du user est différent de celui qui a créé la sauce
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } 
          // Si id est le même : peut supprimer
          else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Aimer ou ne pas aimer une sauce
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
    
    switch (like) {
      // Ajout d'un like
      case 1 :
          Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: `J'aime` }))
            .catch((error) => res.status(400).json({ error }))
              
        break;
      
      // Sauce sans avis
      case 0 :
          Sauce.findOne({ _id: sauceId })
             .then((sauce) => {
              // Enlever son like
              if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }

              // Enlever son dislike
              if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              }
            })
            .catch((error) => res.status(404).json({ error }))
        break;
  
      // Ajout d'un dislike
      case -1 :
          Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
            .catch((error) => res.status(400).json({ error }))
        break;
        
        default:
          console.log(error);
    }
  }