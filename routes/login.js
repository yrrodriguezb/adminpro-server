const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuario');
const { SEED, CLIENT_ID } = require('../config/config');
const client = new OAuth2Client(CLIENT_ID);

// Autenticacion Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });

  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post('/google', async (req, res) => {

  let token = req.body.token;

  let googleUser = await verify(token).catch(err => {
    return res.status(403).json({
      ok: false,
      mensaje: 'Token Invalido'
    });
  });

  Usuario.findById({ email: googleUser.email }, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'error albuscar usuario'
      });
    }

    if (usuario) {
      if (!usuario.google) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe usar su autenticacion normal'
        });
      } else {
        let token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); // 4 Horas

        res.status(200).json({
          ok: true,
          usuario,
          token,
          id: usuario._id
        })
      } 
    } else {
      // Usario no existe se crea
      let usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = '**********';

      usuario.save((err, usuariodb) => {
        let token = jwt.sign({ usuario }, SEED, { expiresIn: 14400 }); // 4 Horas

        res.status(200).json({
          ok: true,
          usuario: usuariodb,
          token,
          id: usuario._id
        })
      });

    }
  });

  /* return res.status(200).json({
    ok: true,
    mensaje: 'Peticion login google POST',
    googleUser
  }); */
})

// Autenticacion Aplicacion
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