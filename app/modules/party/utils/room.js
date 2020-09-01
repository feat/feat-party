import { isGroupContact, isFeatContact } from './contact';

import {
  CONTACT_TYPE_FEAT,
  CONTACT_TYPE_USER,
  CONTACT_TYPE_GROUP,
} from '../constants';

export function getRoomId(contact) {
  if (isGroupContact(contact)) {
    return `${CONTACT_TYPE_GROUP}_${contact.group.id}`;
  }

  if (isFeatContact(contact)) {
    return `${CONTACT_TYPE_FEAT}_${contact.id}`;
  }

  return `${CONTACT_TYPE_USER}_${contact.friend}`;
}
