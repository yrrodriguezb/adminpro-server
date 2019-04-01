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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes.appRoute);
app.use('/login', routes.loginRoute);
app.use('/usuarios', routes.usuarioRoute);



app.listen(3000, () => {
  console.log('Express server runiing in port: 3000 \x1b[32m%s\x1b[0m',  'online');
});