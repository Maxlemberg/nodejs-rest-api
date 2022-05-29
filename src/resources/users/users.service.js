const { UserModel } = require('./users.model');
const { Conflict, Unauthorized, Forbidden, NotFound } = require('http-errors');
const bcrypt = require('bcryptjs');
const { getConfig } = require('../../config');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');

class AuthService {
    async signUp(userParams) {
        const { email, password } = userParams;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Conflict('User with such email already exist');
        }
        const avatarURL = gravatar.url(email, { protocol: 'https', s: '200' });
        return UserModel.create({
            email,
            hashPassword: await this.hashPassword(password),
            avatarURL
        })
    }

    async login(credential) {
        const { email, password } = credential;
        const user = await UserModel.findOne({ email });
        if (!user) {
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

    async getCurrentUser(id) {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new NotFound('User not found');
        }
        if (!user.token) {
            throw new Unauthorized('User is not logged')
        }
        return user;
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

}

exports.AuthService = new AuthService();