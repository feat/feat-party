import { getGroupAvatarUrl } from '@/client/party';

import {
  TEMP_CONTACT_PREFIX,
  CONTACT_TYPE_USER,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_FEAT,
  CONTACT_LIST_STATUS_STRANGER,
} from '../constants';

export const getUserTempContactId = (userId) =>
  `${TEMP_CONTACT_PREFIX}_${CONTACT_TYPE_USER}_${userId}`;

export const createContactWithUser = (user) => {
  const date = new Date();
  return {
    id: getUserTempContactId(user.uid),
    friend: user.uid,
    friend_fullname: user.username,
    friend_last_name: user.lastname,
    friend_first_name: user.firstname,
    avatar: user.avatar ? user.avatar : undefined,
    status: CONTACT_LIST_STATUS_STRANGER,
    contact_time: date.toISOString(),
  };
};

export const createContactWithGroup = (group) => {
  const date = new Date();
  return {
    id: `${TEMP_CONTACT_PREFIX}_${CONTACT_TYPE_GROUP}_${group.id}`,
    group,
    contact_time: date.toISOString(),
  };
};

export const isFeatContact = (contact) => contact.type === CONTACT_TYPE_FEAT;

export const isGroupContact = (contact) => Boolean(contact.group);

export const isTempContact = (contact) => `${contact.id}`.indexOf(TEMP_CONTACT_PREFIX) > -1;

export function getContactType(contact) {
  if (isGroupContact(contact)) {
    return CONTACT_TYPE_GROUP;
  }
  if (contact.type === CONTACT_TYPE_FEAT) {
    return CONTACT_TYPE_FEAT;
  }
  return CONTACT_TYPE_USER;
}

export function getContactEntityId(contact) {
  if (isGroupContact(contact)) {
    return contact.group.id;
  }
  if (contact.type === CONTACT_TYPE_FEAT) {
    return contact.id;
  }
  return contact.friend;
}

export function getContactName(contact) {
  if (!contact) {
    return undefined;
  }
  if (contact.group) {
    return contact.group.name;
  }

  if (isFeatContact(contact)) {
    return contact.name;
  }

  return contact.friend_fullname || String(contact.friend);
}

export function getContactMeta(contact) {
  if (contact.group) {
    return contact.group.creator_fullname || String(contact.group.creator);
  }
  if (contact.expertise instanceof Array) {
    return contact.expertise ? contact.expertise[0] : '';
  }
  if (isFeatContact(contact)) {
    return '';
  }

  return contact.expertise;
}

export function getContactAvatar(contact) {
  if (isGroupContact(contact)) {
    return getGroupAvatarUrl(contact.group.id);
  }
  if (isFeatContact(contact)) {
    return contact.logo;
  }
  return contact.avatar || undefined;
}
