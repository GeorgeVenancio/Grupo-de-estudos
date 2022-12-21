const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) { // Verifica se foi informado um token
        return res.status(401).send({message: 'No token provided'}) 
    }

    const parts = authHeader.split(' ');
    if(!parts.length === 2){
        return res.status(401).json({message: 'Token error'})
    }

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){ // Verificando se existe a palavra "Bearer" na parte scheme.
        return res.status(401).json({ message: 'Token malformatted' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).json({message: 'Token invalid'});

        req.alunoId = decoded.id;
        req.nome = decoded.nome;
        return next();
    })
}