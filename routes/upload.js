const express = require('express')
const fileupload = require('express-fileupload');
const fs = require('fs');
const app = express();

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

app.use(fileupload());

app.put('/:tipo/:id', (req, res, next) => {
  
  let tipo = req.params.tipo;
  let id = req.params.id;

  // Tipos validos
  let tiposValidos = ['usuarios', 'medicos', 'hospitales'];

  if (tiposValidos.indexOf(tipo) < 0)  {
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de coleccion no valida',
      errors: {
        message:  `El tipo de coleccion no es valida, Tipos: [ ${tiposValidos.join(', ')} ].`
      }
    });
  }

  console.log(req.file)
  console.log(req.files)

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No existen archivos para procesar',
      errors: {
        message: 'Debe seleccionar una imagen para procesar.'
      }
    });
  }

  let archivo = req.files.imagen;
  let array = archivo.name.split('.');
  let extension = array[array.length - 1].toLowerCase()

  // Extensiones Permitidas
  let extensiones = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensiones.indexOf(extension) < 0) {
    return res.status(200).json({
      ok: false,
      mensaje: 'Extensión no valida',
      errors: {
        message: `Debe seleccionar una imagen con extension ${extensiones.join(', ')} para procesar.`
      }
    });
  }

  // Nombre del archivo
  let fecha = new Date();
  let token = `${fecha.getFullYear()}${fecha.getMonth()}${fecha.getMilliseconds()}`;
  let nombreArchivo = `${id}-${token}.${extension}`;

  
  // Mover el archivo temporal a la ruta deseada
  let path = `./uploads/${tipo}/${nombreArchivo}`;
  
  archivo.mv(path, err => {

    console.log(err);
    

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al intentar mover la imagen.',
      errors: err
    });
  });

  subirImagenPorTipo (tipo, id, nombreArchivo, res);
});


function subirImagenPorTipo (tipo, id, nombreArchivo, res) {

  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      let pathAnterior = `../uploads/usuarios/${usuario.img}`;

      eliminarImagen(pathAnterior);

      usuario.img = nombreArchivo;

      usuario.save((err, usuarioModificado) => {
        usuarioModificado.password  = null;
        
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actualizada correctamente',
          usuario: usuarioModificado
        });
      })
    })
  }
  else if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      let pathAnterior = `../uploads/medicos/${medico.img}`;

      eliminarImagen(pathAnterior);

      medico.img = nombreArchivo;

      medico.save((err, medicoModificado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actualizada correctamente',
          medico: medicoModificado
        });
      });
    });
  }
  else if (tipo === 'hospitales'){
    Hospital.findById(id, (err, hospital) => {
      let pathAnterior = `../uploads/hospitales/${hospital.img}`;

      eliminarImagen(pathAnterior);

      hospital.img = nombreArchivo;

      hospital.save((err, hospitalModificado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen actualizada correctamente',
          medico: hospitalModificado
        });
      });
    });
  }

  
}

function eliminarImagen(path) {
  if (fs.existsSync(path)) {
    fs.unlink(path);
  }
}


module.exports = app;
