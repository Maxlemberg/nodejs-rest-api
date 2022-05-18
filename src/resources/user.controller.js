const express = require('express')
const { UserService } = require('./user.service');
const { validate } = require('../shared/validate');
const { postSchema, putSchema } = require('./validateContacts');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const contacts = await UserService.getContactsList();
  res.status(200).json(contacts);
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await UserService.getContactById(req.params);
  if (!contact) {
    next();
    return;
  }
  res.json(contact);
})

router.post('/', validate(postSchema), async (req, res, next) => {
  const newContact = await UserService.addContact(req.body);
  res.status(201).json(newContact);
})

router.delete('/:contactId', async (req, res, next) => {
  const response = await UserService.removeContact(req.params);
  response ? res.status(200).json(response) : next();
})

router.put('/:contactId', validate(putSchema), async (req, res, next) => {
  const updatedContact = await UserService.updateContact(req.params, req.body);
  updatedContact ? res.json(updatedContact) : next();
})

exports.usersController = router;
