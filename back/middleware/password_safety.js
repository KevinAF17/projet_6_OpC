const schema = require("../models/password_safety");

//checking user password is ok with our password model.
module.exports = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 8 caractères dont un chiffre, sans espaces",
      {
        "content-type": "application/json",
      }
    );
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};