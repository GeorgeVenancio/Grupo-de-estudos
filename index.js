const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.json());
app.use(cors());

try{
    mongoose.connect(process.env.MONGODB_URI)
} catch (error) {
    console.log("Não foi possivel acessar banco de dados.")
}

const AlunoRoutes = require('./rotas/Aluno');
const GrupoRoutes = require('./rotas/Grupo');

app.use(AlunoRoutes);
app.use(GrupoRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server start!')
});