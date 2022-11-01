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
        error: new Error("Vous n'êtes pas le propriétaire de cette sauce !"),
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
              .then(() => res.status(200).json({message : 'Détails modifiés!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.likeDislikeSauce = (req, res) => {
    // On récupère la sauce
    hotSauce.findOne({ _id: req.params.id })
        .then(sauce => {
           switch (req.body.like) {
                //Si l'utilisateur dislike : 
                case -1:
                    hotSauce.updateOne({ _id: sauce }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: userId },
                    })
                        .then(() => res.status(201).json({ message: 'Sauce dislikée' }))
                        .catch(error => res.status(400).json({ error }))
                    break;

                //Si like ou dislike ! de 0, on retire le like / dislike'
                case 0:
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        hotSauce.updateOne({ _id: sauce_id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId },
                        })
                            .then(() => res.status(201).json({ message: 'Like retiré !' }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    //Si la sauce est déjà disliké :
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        hotSauce.updateOne({ _id: sauce }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId },
                        })
                            .then(() => res.status(201).json({ message: ' Dislike retiré !' }))
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                //Si l'utilisateur like la sauce, +1 :
                case 1:
                    hotSauce.updateOne({ _id: sauce_id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: userId },
                    })
                        .then(() => res.status(201).json({ message: 'Sauce likée !' }))
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }))
}
