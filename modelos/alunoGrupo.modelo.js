const mongoose = require('mongoose');

const AlunoGrupo = mongoose.Schema({
    grupo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupos',
    },
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alunos',
    },
});

module.exports = mongoose.model('GruposAlunos', AlunoGrupo);