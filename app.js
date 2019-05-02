const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');

// Conexion base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if (err) throw err;

  console.log('Base de datos \x1b[32m%s\x1b[0m',  'online');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* 
Server Index Config
var serverIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serverIndex(__dirname + '/uploads')); */

app.use('/', routes.appRoute);
app.use('/busqueda', routes.busquedaRoute);
app.use('/hospitales', routes.hospitalRoute);
app.use('/login', routes.loginRoute);
app.use('/medicos', routes.medicoRoute);
app.use('/upload', routes.uploadRoute);
app.use('/usuarios', routes.usuarioRoute);
app.use('/img', routes.imagenesRoute);

app.listen(3000, () => {
  console.log('Express server runiing in port: 3000 \x1b[32m%s\x1b[0m',  'online');
});
