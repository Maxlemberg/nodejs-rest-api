exports.getConfig = () => {
    const { PORT, MONGODB_URI, MONGODB_DB_NAME, BCRYPT_SALT_ROUNDS, JWT_SECRET, JWT_EXPIRES_IN } = process.env;
    return {
        port: PORT,
        database: {
            url: MONGODB_URI,
            name: MONGODB_DB_NAME,
        },
        bcrypt: {
            salt: parseInt(BCRYPT_SALT_ROUNDS)
        },
        jwt: {
            secret: JWT_SECRET,
            expiresIn: JWT_EXPIRES_IN
        }
    }
}