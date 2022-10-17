const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauces');
const saucesPiq = require('../models/sauces');

router.post('/', auth, multer, sauceCtrl.createSauce)

router.post('/', (req, res, next ) => {
    delete req.body._id;
    const sauce = new saucesPiq({
      ...req.body
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

  router.put('/:id', (req, res, next) => {
    saucesPiq.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

  router.delete('/:id', (req, res, next) => {
    saucesPiq.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });

  router.use('/:id', (req, res, next) => {
    saucesPiq.findOne({ _id: req.params.id })
      .then(hotSauces => res.status(200).json(hotSauces))
      .catch(error => res.status(400).json({ error }));
  });

 router.get('/', (req, res, next) => {
    saucesPiq.find()
      .then(hotSauces => res.status(200).json(hotSauces))
      .catch(error => res.status(400).json({ error }));
  });

module.exports = router;