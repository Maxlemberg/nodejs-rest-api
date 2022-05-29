const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

exports.compressImg = () => {
    return async (req, res, next) => {
        const uncompressedImgPath = req.file.path;
        const file = await Jimp.read(uncompressedImgPath);
        const compressedFilePath = path.join(__dirname, '../public/avatars', req.file.filename);

        await file.resize(250, 250).writeAsync(compressedFilePath);
        // req.file.path = compressedFilePath;
        // fs.unlink(path.join(__dirname, '../../tmp', req.file.filename));
        next();
    }
}