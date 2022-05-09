function validateContacts(contact, flag = '') {
    if (flag) {
        return (contact.name || contact.email || contact.phone);
    }
    return (contact.name && contact.email && contact.phone);
}

module.exports = validateContacts;
