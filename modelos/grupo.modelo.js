const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GrupoDeEstudoModelSchema = Schema({
    meta: String,
    descricao: String,
    data_encontros: String,
    material: {
        cloudinary_id: String,
        secure_url: String
    }
});

module.exports = mongoose.model("Grupos", GrupoDeEstudoModelSchema);