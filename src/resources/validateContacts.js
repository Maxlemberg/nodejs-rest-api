const Joi = require("joi");

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

module.exports = {
    postSchema,
    putSchema
}

// function validateContacts(req, res, next) {
//     const schema = Joi.object({
//         name: Joi.string().required().min(2),
//         email: Joi.string().email().required(),
//         phone: Joi.number().required()
//     })
//     const result = schema.validate(req.body);
//     if (result.error) {
//         return res.status(400).json({ message: "missing required name field" });
//     }
//     next();
// }

// function validatePutContacts({ body }, res, next) {
//     if (body.name || body.email || body.phone) {
//         next();
//         return;
//     }
//     return res.status(400).json({ "message": "missing fields" });
// }

// module.exports = { validateContacts, validatePutContacts };
