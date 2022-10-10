const express = require('express');
const mongoose = require('mongoose');
const saucePiqRoads = require('./routes/sauces')
const saucesPiq = require('./models/sauces');

const app = express();

mongoose.connect('mongodb+srv://KevinAF4:Clust3r-0pC6@clusterp6.yrwj1f0.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/sauces', saucePiqRoads);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauce = new saucesPiq({
      ...req.body
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.put('/api/sauces/:id', (req, res, next) => {
    sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.delete('/api/stuff/:id', (req, res, next) => {
    sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.use('/api/sauces/:id', (req, res, next) => {
    sauce.findOne({ _id: req.params.id })
      .then(hotSauces => res.status(200).json(hotSauces))
      .catch(error => res.status(400).json({ error }));
  });

 app.get('/api/sauces', (req, res, next) => {
    sauce.find()
      .then(hotSauces => res.status(200).json(hotSauces))
      .catch(error => res.status(400).json({ error }));
  });

module.exports = app;