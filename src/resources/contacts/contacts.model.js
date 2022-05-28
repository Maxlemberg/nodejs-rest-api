const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
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

contactSchema.statics.updateUser = (id, updateParams) => {
    return this.ContactsModel.findOneAndUpdate(id, updateParams, { new: true });
}

exports.ContactsModel = model('contacts', contactSchema);