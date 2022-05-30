const { NotFound, Conflict } = require("http-errors");
const { ContactsModel } = require('./contacts.model');


class ContactService {

  async getContactsList() {
    return ContactsModel.find();
  }

  async paginateContacts(offset, limit) {
    return await ContactsModel.find().limit(limit).skip(offset);
  }

  async getContactById(id) {
    const user = await ContactsModel.findById(id);
    if (!user) {
      throw new NotFound(`User with id '${id
        }' not found`)
    }
    return user;
  }

  async removeContact({ contactId }) {
    const user = await ContactsModel.findOneAndRemove({ _id: contactId });
    if (!user) {
      throw new NotFound(`User with id '${contactId
        }' not found`)
    }
  }

  async addContact(body) {
    const existingUser = await ContactsModel.findOne({ email: body.email });
    if (existingUser) {
      throw new Conflict('User with such email already exists');
    }
    return await ContactsModel.create(body);
  }

  async updateStatusContact({ contactId }, body) {
    const updatedUser = await ContactsModel.updateUser({
      _id: contactId
    }, body);
    if (!updatedUser) {
      throw new NotFound(`User with id '${contactId
        }' not found`)
    }
    return updatedUser;
  }
}

exports.ContactService = new ContactService;

