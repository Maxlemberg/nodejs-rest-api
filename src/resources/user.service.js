const { NotFound, Conflict } = require("http-errors");
const { UserModel } = require('./user.model');


class UserService {

  async getContactsList() {
    return UserModel.find();
  }

  async getContactById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new NotFound(`User with id '${id
        }' not found`)
    }
    return user;
  }

  async removeContact({ contactId }) {
    const user = await UserModel.findOneAndRemove({ _id: contactId });
    if (!user) {
      throw new NotFound(`User with id '${contactId
        }' not found`)
    }
  }

  async addContact(body) {
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) {
      throw new Conflict('User with such email already exists');
    }
    return await UserModel.create(body);
  }

  async updateStatusContact({ contactId }, body) {
    const updatedUser = await UserModel.updateUser({
      _id: contactId
    }, body);
    if (!updatedUser) {
      throw new NotFound(`User with id '${contactId
        }' not found`)
    }
    return updatedUser;
  }
}

exports.UserService = new UserService;

