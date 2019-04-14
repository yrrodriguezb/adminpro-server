const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


// verificar token
exports.verificarToken = function (req, res, next) {
  let token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'Token Incorrecto',
        errors: err
      })
    }

    req.usuario = decoded.usuario;
    next();
  });
}