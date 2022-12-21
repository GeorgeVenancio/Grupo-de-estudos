const grupoRoute = require('express').Router()
const GrupoModel = require('../modelos/grupo.modelo')
const grupoAluno = require('../modelos/alunoGrupo.modelo')
const multer = require('../middlewres/multerFile')
const cloudinary = require('cloudinary').v2
const authMiddleware  = require('../middlewres/auth')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

grupoRoute.use(authMiddleware)

//POST para criar grupo de estudo
grupoRoute.post('/grupo/criar', multer.single('arquivo'), async(req, res) => {
    try{
        const{alunoId, meta, descricao, data_encontros} = req.body

        if(req.file){
            const uploadPDF = await cloudinary.uploader.upload(req.file.path, (error) => {
                if(error) {
                    return res.status(400).send({ message: 'Falha no upload de arquivo.' });
                }
            });

            const grupo = await GrupoModel.create({
                meta,
                descricao,
                data_encontros,
                material: {
                    cloudinary_id: uploadPDF.public_id,
                    secure_url: uploadPDF.secure_url
                },
            });

            await grupoAluno.create({
                grupo: grupo._id,
                aluno: alunoId
            })

            res.json({mensagem: "Grupo criado com sucesso"})
    
        }

    }catch(erro){
        res.json({mensagem: "Erro na criação do grupo"})
        console.log(erro)
    }
});

///GET para buscar buscar os grupos de um aluno
grupoRoute.get('/meus-grupos/:id', async(req, res) => {
    try{
        const meus = await grupoAluno.find({aluno: req.params.id}).populate("grupo");
        res.json(meus)

    }catch(erro){
        res.json({mensagem: "Erro na consulta dos grupos de estudos"})
        console.log(erro)
    }
});

///GET para buscar buscar todos os grupos
grupoRoute.get('/grupos/:id', async(req, res) => {
    try{
        const meus = await grupoAluno.find({aluno: req.params.id});
        const meusIDs = meus.map(g => g.grupo.toString());
        const grupos = await GrupoModel.find({});
        const disponiveis = grupos.filter(g => !meusIDs.includes(g._id.toString()));
        res.json(disponiveis)

    }catch(erro){
        res.json({mensagem: "Erro na consulta dos grupos de estudos"})
        console.log(erro)
    }
});

//POST para entrar em um grupo
grupoRoute.post('/grupo/entrar', async(req, res) => {

    try {
        const { alunoId, grupoId } = req.body
        await grupoAluno.create({
            grupo: grupoId,
            aluno: alunoId
        })

        return res.json({message: "Entrou no grupo com sucesso"})
    } catch (error) {
        console.log(error)
        res.json({mensagem: 'Erro ao tentar entrar em grupo'});
    }
});

//POST para sair de grupo
grupoRoute.post('/grupo/sair', async(req, res) => {

    try {
        const { alunoId, grupoId } = req.body

        await grupoAluno.deleteOne({aluno: alunoId, grupo: grupoId});
        return res.json({message: "Saiu do grupo com sucesso."});
        
    } catch (error) {
        res.json({mensagem: 'Erro ao tentar sair do aluno!'});
    }
});

// GET para ver informações de um grupos por ID
grupoRoute.get('/grupo/:id', async(req, res) => {

    try {
        const grupo = await GrupoModel.findById({_id: req.params.id});
    
        res.json(grupo);

    } catch (error) {
        
        res.json({
            message: "Grupo não encontrado!"
        });
    }  
})

module.exports = grupoRoute;