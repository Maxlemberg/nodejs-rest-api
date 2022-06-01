const express = require('express');
const { catchErrors } = require('../../shared/catch-errors');
const { validate } = require('../../shared/validate');
const { signUpSchema } = require('./users.schema');
const { AuthService } = require('./users.service');
const { serializeSignUp, serializeSignIn, serializeAvatar } = require('./user.serializers');
const { authorize } = require('../../shared/authorize');
const { upLoadFile } = require('../../shared/saveImg');
const { compressImg } = require('../../shared/compressImg');

const router = express.Router();

router.get('/verify/:verificationToken', catchErrors(async (req, res, next) => {
    const { verificationToken } = req.params;
    await AuthService.getCurrentUser(verificationToken);
    await AuthService.updateData({ verificationToken: null, verify: true });
    res.status(200).send({ message: 'Verification successful' })
}))

router.post('/verify', catchErrors(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ "message": "missing required field email" })
    }
    const response = await AuthService.sendVerifyEmailRepeatedly(email);
    if (!response) {
        res.send(400).json({ message: "Verification has already been passed" })
    }
    res.status(200).send();
}))

router.post('/signup', validate(signUpSchema), catchErrors(async (req, res, next) => {
    const user = await AuthService.signUp(req.body);
    res.status(201).json(serializeSignUp(user));
}));

router.post('/login', validate(signUpSchema), catchErrors(async (req, res, next) => {
    const signInUser = await AuthService.login(req.body);
    res.status(201).json(serializeSignIn(signInUser));
}));

router.get('/logout', authorize, catchErrors(async (req, res, next) => {
    await AuthService.logout(req.userId);
    res.sendStatus(204);
}));

router.get('/current', authorize, catchErrors(async (req, res, next) => {
    const user = await AuthService.getCurrentUser(req.userId);
    res.status(200).send(serializeSignUp(user));
}));

router.patch('/avatars',
    authorize,
    upLoadFile.single('avatar'),
    compressImg(),
    catchErrors(async (req, res, next) => {
        const user = await AuthService.updateAvatarUrl(req.userId, req.file.filePath);
        res.status(200).send(serializeAvatar(user));
    }));

exports.UsersController = router;