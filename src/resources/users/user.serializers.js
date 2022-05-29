exports.serializeSignUp = (user) => {
    const { email, subscription } = user;
    return {
        user: {
            email,
            subscription
        }
    }
}

exports.serializeSignIn = (signInResponse) => {
    const { email, token } = signInResponse;
    return {
        user: {
            email,
            token
        }
    }
}

exports.serializeAvatar = (userResponse) => {
    const { avatarURL } = userResponse;
    return {
        avatarURL
    }
}