const { UserModel } = require('./users.model');
const { Conflict, Unauthorized, Forbidden, NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const { getConfig } = require('../../config');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');
const { sendMail } = require('../../shared/sendMailer');

class AuthService {

    async sendVerifyEmailRepeatedly(email) {
        const user = await UserModel.findOne({ email });
        if (!user.verify) {
            const verificationToken = uuidv4();
            const res = await sendMail(verificationToken);
            return res;
        }
    };

    async signUp(userParams) {
        const { email, password } = userParams;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Conflict('User with such email already exist');
        }
        const avatarURL = gravatar.url(email, { protocol: 'https', s: '200' });
        const verificationToken = uuidv4();
        await sendMail(verificationToken);
        return UserModel.create({
            email,
            hashPassword: await this.hashPassword(password),
            avatarURL,
            verificationToken
        });
    }

    async login(credential) {
        const { email, password } = credential;
        const user = await UserModel.findOne({ email });
        if (!user || !user.verify) {
            throw new Unauthorized('Email or password is wrong');
        }

        const isCorrectPassword = await this.isPasswordCorrect(password, user.hashPassword);
        if (!isCorrectPassword) {
            throw new Forbidden('Password is not correct');
        }

        const token = this.generateToken(user.id);

        return await this.updateToken(user.id, token);
    }

    async logout(id) {
        const user = await this.updateToken(id, null);
        if (!user) {
            throw new NotFound(`User with ${id} not found`);
        }
    }

    async getCurrentUser(data) {
        const user = await UserModel.findOne({ data })
        if (!user) {
            throw new NotFound('User not found');
        }
        if (!user.token) {
            throw new Unauthorized('User is not logged')
        }
        return user;
    }

    async updateAvatarUrl(id, avatarURL) {
        return UserModel.findByIdAndUpdate({ _id: id }, { avatarURL }, { new: true });
    }

    async hashPassword(password) {
        const config = getConfig();
        return bcrypt.hash(password, config.bcrypt.salt);
    }

    async isPasswordCorrect(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }

    generateToken(userId) {
        const config = getConfig();
        return jwt.sign({ sub: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }

    async updateToken(id, token) {
        return UserModel.findByIdAndUpdate({ _id: id }, { token }, { new: true });
    }

    async updateData(data, objParams) {
        return UserModel.findOneAndUpdate({ data }, { "$set": { ...objParams } }, { new: true });
    }

}

exports.AuthService = new AuthService();