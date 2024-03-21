const multer = require('multer');
const path = require('path');

// Configuração do Multer para salvar arquivos na pasta desejada
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/imagemT');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;


