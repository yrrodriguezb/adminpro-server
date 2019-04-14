const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const SEED =require('../config/config').SEED;


app.post('/', (req, res) => {
  const body = req.body; 

  Usuario.findOne({ email: body.email }, (err, usuariodb) => {
    console.log(usuariodb);
    
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion login POST fallida',
        errors: err
      });
    }

    if (!usuariodb) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion login POST fallida, credenciales incorrectas - email',
        errors: err
      });
    }

    if (!bcrypt.compareSync(body.password, usuariodb.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion login POST fallida, credenciales incorrectas - password',
        errors: err
      });
    }

    // crear token
    usuariodb.password = null;
    let token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 14400 }); // 4 Horas

    res.status(200).json({
      ok: true,
      usuario: usuariodb,
      token,
      id: usuariodb._id
    })
  });
});

module.exports = app;