const serializeUser = (user) => {
    return {
        id: user.id,
        userName: user.name,
        email: user.email,
        phone: user.phone,
        favorite: user.favorite
    }
}

const serializeUsers = (users) => {
    return users.map(serializeUser);
};

module.exports = {
    serializeUser,
    serializeUsers
}