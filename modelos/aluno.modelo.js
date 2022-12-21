const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlunoSchema = Schema({
    nome: String,
    email: String,
    senha: String,
    foto:  {
        cloudinary_id: String,
        secure_url: String
    },
});

module.exports = mongoose.model("Alunos", AlunoSchema);