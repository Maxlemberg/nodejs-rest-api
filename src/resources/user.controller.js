const express = require('express')
const { UserService } = require('./user.service');
const { validate, validatePatch } = require('../shared/validate');
const { postSchema, putSchema, idSchema, patchSchema } = require('./validateContacts');
const { catchErrors } = require('../shared/catch-errors');
const router = express.Router();
const { serializeUser, serializeUsers } = require('./user.serializers');

router.get('/', catchErrors(async (req, res, next) => {
  const contacts = await UserService.getContactsList();
  res.status(200).json(serializeUsers(contacts));
})
)

router.get('/:contactId', validate(idSchema, 'params'), catchErrors(async (req, res, next) => {
  const contact = await UserService.getContactById(req.params.contactId);
  res.json(serializeUser(contact));
})
)

router.post('/', validate(postSchema), catchErrors(async (req, res, next) => {
  const newContact = await UserService.addContact(req.body);
  res.status(201).json(serializeUser(newContact));
})
)

router.delete('/:contactId', validate(idSchema, 'params'), catchErrors(async (req, res, next) => {
  await UserService.removeContact(req.params);
  res.status(204).send();
})
)

router.put('/:contactId', validate(idSchema, 'params'), validate(putSchema),
  catchErrors(async (req, res, next) => {
    const updatedContact = await UserService.updateStatusContact(req.params, req.body);
    res.json(updatedContact);
  })
)

router.patch('/:contactId/favorite', validate(idSchema, 'params'), validatePatch(patchSchema),
  catchErrors(async (req, res, next) => {
    const updatedContact = await UserService.updateStatusContact(req.params, req.body);
    res.status(200).json(updatedContact);
  })
)

exports.usersController = router;
