const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
})

userSchema.statics.updateUser = (id, updateParams) => {
    return this.UserModel.findOneAndUpdate(id, updateParams, { new: true });
}

exports.UserModel = model('contacts', userSchema);