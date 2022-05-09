const fs = require('fs').promises;
const path = require('path');
const { nextTick } = require('process');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    return data;
  } catch (error) {
    console.log(error);
  }
}

const getContactById = async ({ contactId }) => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    const contact = data.find(({ id }) => id.toString() === contactId.toString());
    return contact;
  } catch (error) {
    console.error(error);
  }
}

const removeContact = async ({ contactId }) => {
  try {
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    const deleteContact = data.find(({ id }) => parseInt(id) === parseInt(contactId));
    if (deleteContact) {
      const newData = data.filter(({ id }) => parseInt(id) !== parseInt(contactId));
      await fs.writeFile(contactsPath, JSON.stringify(newData));
      return { "message": "contact deleted" };
    }
    return;
  } catch (error) {
    console.error(error);
  }
}

const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const newContact = {
      id: uuidv4(), name, email, phone
    }
    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    await fs.writeFile(contactsPath, JSON.stringify([...data, newContact]));
    return newContact;
  } catch (error) {
    console.error(error);
  }
}

const updateContact = async ({ contactId }, body) => {
  try {
    let flag = false;
    let updatedContact = {};

    const data = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
    const editedContacts = data.map(el => {
      if (parseInt(el.id) === parseInt(contactId)) {
        flag = true;
        updatedContact = { ...el, ...body };
        return updatedContact;
      }
      return el;
    });

    if (flag) {
      await fs.writeFile(contactsPath, JSON.stringify(editedContacts));
      return updatedContact;
    }
    return flag;

  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
