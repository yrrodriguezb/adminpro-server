const express = require('express')
const app = express();
const Medico = require('../models/medico');
const middlewareAutenticacion = require('../middleware/autenticacion');


// Obtener todos los medicos
app.get('/', (req, res, next) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion GET fallida',
        errors: err
      })
    }

    Medico.count({}, (err, cantidad) => {
      res.status(200).json({
        ok: true,
        total: cantidad,
        medicos
      });
    })
  });

});

// Crear Medico
app.post('/', middlewareAutenticacion.verificarToken, (req, res) => {
  let body = req.body;

  const medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion POST fallida',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: data
    });
  });
});


// Actualizar Medico
app.put('/:id', middlewareAutenticacion.verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion PUT fallida',
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion PUT fallida, el hospital no existe',
        errors: {
          message: 'El usuario no existe'
        }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Peticion PUT fallida, error al actualizar los datos',
          errors: err
        });
      }
      
      res.status(200).json({
        ok: true,
        medico: data
      });
    })

  });
});


// Eliminar Medico
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