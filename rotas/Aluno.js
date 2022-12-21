const alunoRoute = require('express').Router();
const AlunoModel = require('../modelos/aluno.modelo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2
const multer = require('../middlewres/multerImage');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

//POST para cadastrar o aluno
alunoRoute.post('/aluno/cadastro', multer.single('foto'), async(req, res) => {
    try{
        const {nome,email,senha} = req.body;
        const senhac = await bcrypt.hash(senha, 10)
 
        if((await AlunoModel.findOne({email}))){
            return res.json({mensagem: 'Erro! Usuário com esse email já existe'}); 
        }

        if(req.file){
            const uploadImage = await cloudinary.uploader.upload(req.file.path, (error) => {
                if(error) {
                    return res.status(400).send({ message: 'Falha no upload de imagem' });
                }
            });
            
            await AlunoModel.create({
                nome,
                email,
                senha: senhac,
                foto: {
                    cloudinary_id: uploadImage.public_id,
                    secure_url: uploadImage.secure_url
                }
            });
        } else {
            await AlunoModel.create({
                nome,
                email,
                senha: senhac
            });
        }

        return res.json({mensagem: 'Aluno cadastrado com sucesso :)'})

    }catch(erro){
        res.json({mensagem: 'Erro no cadastro do aluno'})
        console.log(erro)
    }
});

//POST para login do aluno
alunoRoute.post("/aluno/login", async (req, res) => {
    const {email, senha} = req.body;
  
    const aluno = await AlunoModel.findOne({ email });

    if (!aluno) {
      return res.json({ mensagem: "Usuário não encontrado!" });
    }

    if (!await bcrypt.compare(senha, aluno.senha)) { 
        return res.json({mensagem: "Erro! Senha incorreta."})   
    }
    
    const token = jwt.sign({ email: aluno.email }, process.env.JWT_SECRET, {expiresIn: 864000});

    aluno.senha = undefined;
    return res.json({ token: token, aluno: aluno});
});


//PUT para adicionar foto de usuario
alunoRoute.put('/aluno/atualizar-foto/:id', multer.single('foto'), async (req, res) => {
    try {
        const aluno = await AlunoModel.findById({_id: req.params.id});
        
        if (req.file){
            if (aluno.foto.cloudinary_id) {
                await cloudinary.uploader.destroy(aluno.foto.cloudinary_id);
                const uploadImage = await cloudinary.uploader.upload(req.file.path);

                await AlunoModel.updateOne(
                    { _id: req.params.id },
                    {
                        foto: {
                            cloudinary_id: uploadImage.public_id,
                            secure_url: uploadImage.secure_url  
                        }
                    });
            } else {
                const uploadImage = await cloudinary.uploader.upload(req.file.path);

                await AlunoModel.updateOne(
                    { _id: req.params.id },
                    {
                        foto: {
                            cloudinary_id: uploadImage.public_id,
                            secure_url: uploadImage.secure_url  
                        }
                    });
            }
        }
        return res.json({mensagem: 'Imagem atualizada com sucesso!'});
    } catch (error) {
        console.log(error)
        res.json({mensagem: 'Erro na atualização!'});
    }
});

module.exports = alunoRoute;