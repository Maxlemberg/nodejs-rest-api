const Joi = require("joi");
const { objectId } = require('../shared/object-id');


const postSchema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    phone: Joi.number().required()
})

const putSchema = Joi.object().keys({
    name: Joi.string().min(2),
    email: Joi.string().email(),
    phone: Joi.number()
}).or('name', 'email', 'phone');

const idSchema = Joi.object({
    contactId: Joi.string().custom(objectId),
})

const patchSchema = Joi.object({
    favorite: Joi.boolean().required()
})

module.exports = {
    postSchema,
    putSchema,
    idSchema,
    patchSchema
}

