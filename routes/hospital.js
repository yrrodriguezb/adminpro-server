const express = require('express')
const app = express();
const Hospital = require('../models/hospital');
const middlewareAutenticacion = require('../middleware/autenticacion');


// Obtener todos los hospitales
app.get('/', (req, res, next) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion GET fallida',
        errors: err
      })
    }

    Hospital.count({}, (err, cantidad) => {
      res.status(200).json({
        ok: true,
        total: cantidad,
        hospitales
      });
    })
  });

});

// Crear hospital
app.post('/', middlewareAutenticacion.verificarToken, (req, res) => {
  let body = req.body;

  const hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion POST fallida',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: data
    });
  });
});


// Actualizar hospital
app.put('/:id', middlewareAutenticacion.verificarToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Peticion PUT fallida',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Peticion PUT fallida, el hospital no existe',
        errors: {
          message: 'El usuario no existe'
        }
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, data) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Peticion PUT fallida, error al actualizar los datos',
          errors: err
        });
      }
      
      res.status(200).json({
        ok: true,
        hospital: data
      });
    })

  });
});


// Eliminar hospital
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