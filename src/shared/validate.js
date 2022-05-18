exports.validate = (schema, reqPart = "body") => {
    return (req, res, next) => {
        const result = schema.validate(req[reqPart]);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        next();
    }
}