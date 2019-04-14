const express = require('express')
const app = express();
const Hospital = require('../models/hospital');
const Medicos = require('../models/medico');
const Usuarios = require('../models/usuario');


// Busqueda por colleción
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
  let busqueda = req.params.busqueda;
  let tabla = req.params.tabla;
  let promesa;
  let regex = new RegExp(busqueda, 'i');

  switch (tabla) {
    case 'usuarios':
      promesa = buscarUsuarios(busqueda, regex);
      break;
    case 'medicos':
      promesa = buscarMedicos(busqueda, regex);
      break;
    case 'hospitales':
      promesa = buscarHospitales(busqueda, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensaje: 'Tipo de busqueda invalido',
        error: {
          message: 'Tipo de tabla/colleccion invalido'
        }
      })
  }

  promesa.then(data => {
    res.status(200).json({
      ok: true,
      [tabla]: data
    })
  })
});

// Busqueda General
app.get('/todo/:busqueda', (req, res, next) => {
  let busqueda  = req.params.busqueda;
  let regex = new RegExp(busqueda, 'i');

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuarios(busqueda, regex)
  ]).then( resultadoBusqueda => {
    res.status(200).json({
      ok: true,
      hospitales: resultadoBusqueda[0],
      medicos: resultadoBusqueda[1],
      usuarios: resultadoBusqueda[2]
    })
  })
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre:  regex })
      .populate('usuario', 'nombre email')
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al consultar Hodpitales ", err);
        }
        else {
          resolve(hospitales);
        }
      })
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medicos.find({ nombre:  regex })
      .populate('usuario', 'nombre email')
      .populate('hospital')
      .exec((err, medicos) => {
        if (err) {
          reject("Error al consultar los medicos ", err);
        }
        else {
          resolve(medicos);
        }
      })
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Usuarios
      .find({}, 'nombre email role')
      .or([{ nombre: regex }, { email: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al consultar los usuarios. ", err)
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;