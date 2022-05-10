const express = require('express')
const { listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
} = require('../../models/contacts');
const { validateContacts, validatePutContacts } = require('../../models/validateContacts.js');

const router = express.Router()

router.get('/', async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await getContactById(req.params);
  if (!contact) {
    next();
  }
  res.json(contact);
})

router.post('/', validateContacts, async (req, res, next) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
})

router.delete('/:contactId', async (req, res, next) => {
  const response = await removeContact(req.params);
  response ? res.status(200).json(response) : next();
})

router.put('/:contactId', validatePutContacts, async (req, res, next) => {
  const updatedContact = await updateContact(req.params, req.body);
  updatedContact ? res.json(updatedContact) : next();
})

module.exports = router
