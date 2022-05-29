const { Schema, model, SchemaTypes } = require('mongoose');

const userSchema = new Schema({
    hashPassword: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String
    },
    owner: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    }
});

exports.UserModel = model('user', userSchema);