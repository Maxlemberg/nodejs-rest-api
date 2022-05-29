const { catchErrors } = require('../../shared/catch-errors');
// const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const { upLoadFile } = require('../../shared/saveImg');

const router = express.Router();

/* Alternatives router express static images */

// router.get('/:imgName', catchErrors(async (req, res, next) => {
//     const { imgName } = req.params;
//     const filesPath = path.join(__dirname, '../../public/avatars', imgName);
//     const img = await fs.readFile(filesPath);
//     res.writeHead(200, { 'Content-Type': 'image/jpeg' }).end(img);
// }))

router.post('/upload', upLoadFile.single('avatar'), catchErrors((req, res, next) => {
    res.status(200).send();
}))

router.use('/', express.static(path.join(__dirname, '../../public/avatars')));

exports.FilesController = router;