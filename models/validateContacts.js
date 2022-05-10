const Joi = require("joi");

function validateContacts(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.number().required()
    })
    const result = schema.validate(req.body);
    if (result.error) {
        return res.status(400).json({ message: "missing required name field" });
    }
    next();
}

function validatePutContacts({ body }, res, next) {
    if (body.name || body.email || body.phone) {
        next();
        return;
    }
    return res.status(400).json({ "message": "missing fields" });
}

module.exports = { validateContacts, validatePutContacts };
