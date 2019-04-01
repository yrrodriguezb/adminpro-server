const express = require('express')
const app = express();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const middlewareAutenticacion = require('../middleware/autenticacion');


// Obtener todos los usuarios
app.get('/', (req, res, next) => {

  Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion GET fallida',
        errors: err
      })
    }

    res.status(200).json({
      ok: true,
      usuarios
    });
  });

});

// Crear usuario
app.post('/', middlewareAutenticacion.verificarToken, (req, res) => {
  let body = req.body;

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion POST fallida',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: data,
      usuarioToken: req.usuario
    });
  });
});


// Actualizar usuario
app.put('/:id', middlewareAutenticacion.verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Usuario.findById(id, (err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion PUT fallida',
        errors: err
      });
    }

    if (!data) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion PUT fallida, el usuario no existe',
        errors: {
          message: 'El usuario no existe'
        }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Peticion PUT fallida, error al actualizar los datos',
          errors: err
        });
      }

      data.password = '';
      
      res.status(200).json({
        ok: true,
        usuario: data
      });
    })

  });
});


// Eliminar usuario
app.delete('/:id', middlewareAutenticacion.verificarToken, (req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion DELETE fallida, error al eliminar los datos',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuario: data
    })
  });
});

module.exports = app;