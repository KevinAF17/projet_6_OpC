const hotSauce = require('../models/sauces');

exports.createSauce = (req, res, next) => {
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new hotSauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  }