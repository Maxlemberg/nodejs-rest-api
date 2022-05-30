const Joi = require('joi');

exports.signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

