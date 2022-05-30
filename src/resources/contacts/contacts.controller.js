const express = require('express')
const { ContactService } = require('./contacts.service');
const { validate, validatePatch } = require('../../shared/validate');
const { postSchema, putSchema, idSchema, patchSchema } = require('./validateContacts');
const { catchErrors } = require('../../shared/catch-errors');
const { serializeUser, serializeUsers } = require('./contacts.serializers');

const router = express.Router();

router.get('/', catchErrors(async (req, res, next) => {
  let contacts;
  if (req.query) {
    const { page, limit } = req.query;
    contacts = await ContactService.paginateContacts(page, limit);
  } else {
    contacts = await ContactService.getContactsList();
  }
  res.status(200).json(serializeUsers(contacts));
})
)

router.get('/:contactId', validate(idSchema, 'params'), catchErrors(async (req, res, next) => {
  const contact = await ContactService.getContactById(req.params.contactId);
  res.json(serializeUser(contact));
})
)

router.post('/', validate(postSchema), catchErrors(async (req, res, next) => {
  const newContact = await ContactService.addContact(req.body);
  res.status(201).json(serializeUser(newContact));
})
)

router.delete('/:contactId', validate(idSchema, 'params'), catchErrors(async (req, res, next) => {
  await ContactService.removeContact(req.params);
  res.sendStatus(204);
})
)

router.put('/:contactId', validate(idSchema, 'params'), validate(putSchema),
  catchErrors(async (req, res, next) => {
    const updatedContact = await ContactService.updateStatusContact(req.params, req.body);
    res.json(updatedContact);
  })
)

router.patch('/:contactId/favorite', validate(idSchema, 'params'), validatePatch(patchSchema),
  catchErrors(async (req, res, next) => {
    const updatedContact = await ContactService.updateStatusContact(req.params, req.body);
    res.status(200).json(updatedContact);
  })
)

exports.contactsController = router;
