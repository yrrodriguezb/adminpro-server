const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ROLES = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo electronico es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatorio']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'USER_ROLE',
    enum: ROLES
  }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
