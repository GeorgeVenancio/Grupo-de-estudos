const multer = require('multer');
const path = require('path');


module.exports = multer({
    storage: multer.diskStorage({
        filename: function (req, file, callback) {
            const extensaoArquivo = path.extname(file.originalname);
            const novoNomeArquivo = require('crypto')
                .randomBytes(32)
                .toString('hex');
            callback(null, `${novoNomeArquivo}${extensaoArquivo}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"), false);
            return;
          }
        cb(null, true)
    }
});