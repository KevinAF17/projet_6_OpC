const hotSauce = require('../models/sauces');
const fs = require('fs');


exports.getAllSauces = (req, res, next) => {
  hotSauce.find()
  .then((sauces) => res.status(200).json(sauces))
  .catch(error => res.status(400).json({error}))
};

exports.getOneSauce = (req, res, next) => {
  hotSauce.findOne({ _id: req.params.id })
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.user_id;
    const sauce = new hotSauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  }

exports.deleteSauce = (req, res, next) => {
    hotSauce.findOne({ _id: req.params.id }).then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: new Error("La sauce cherchée n'existe pas ici !") });
      }
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({
        error: new Error(
            "Vous n'êtes pas le propriétaire de cette sauce."
        ),
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
      hotSauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "La sauce sélectionée a été supprimée !" }))
        .catch((error) => res.status(400).json({ error }));
      });
    });
  };

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  hotSauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              hotSauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};