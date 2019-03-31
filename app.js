const express = require('express');
const mongoose = require('mongoose');


const app = express();

// Conexion base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if (err) throw err;

  console.log('Base de datos \x1b[32m%s\x1b[0m',  'online');
});


app.get('/', (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Peticion realizada correctamente'
  });

  res.end();
});


app.listen(3000, () => {
  console.log('Express server runiing in port: 3000 \x1b[32m%s\x1b[0m',  'online');
});