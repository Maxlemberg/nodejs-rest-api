exports.getConfig = () => {
    const { PORT, MONGODB_URI, MONGODB_DB_NAME } = process.env;
    return {
        port: PORT,
        database: {
            url: MONGODB_URI,
            name: MONGODB_DB_NAME
        }
    }
}