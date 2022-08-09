// Appele de Mongoose : 
const mongoose = require('mongoose');


// Appel de Mongoose uniqueValidator
const uniqueValidator = require('mongoose-unique-validator');


// Créer un schéma Mongoose pour se connecter
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Appliquer l'uniqueValidator au userSchema
userSchema.plugin(uniqueValidator);

// Exporter le schéma de connexion
module.exports = mongoose.model('User', userSchema);