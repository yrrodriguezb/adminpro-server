const moongoose = require("mongoose");
const Schema = moongoose.Schema;

const hospitalSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es requerido"]   
  },
  img: {
    type: String,
    required: false
  },
  usuario: {
    type: Schema.Types.ObjectId, 
    ref: "Usuario"  
  }
}, {
  collection: "hospitales"
});

module.exports = moongoose.model("Hospital", hospitalSchema);

