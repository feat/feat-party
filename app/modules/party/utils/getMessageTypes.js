import * as PARTY_CONSTANTS from '../constants';
import { isGroupContact, isFeatContact } from './contact';

export function getInboxMessageTypes(contact) {
  if (isFeatContact(contact)) {
    return getFeatInboxMessageTypes();
  }
  if (isGroupContact(contact)) {
    return getGroupInboxMessageTypes();
  }
  return getUserInboxMessageTypes();
}

export function getRoomInboxMessageTypes() {
  return [
    ...PARTY_CONSTANTS.UESR_INBOX_MESSAGE_TYPES,
    ...PARTY_CONSTANTS.GROUP_INBOX_MESSAGE_TPYES,
  ];
}

export function getGroupInboxMessageTypes() {
  return PARTY_CONSTANTS.GROUP_INBOX_MESSAGE_TPYES;
}

export function getUserInboxMessageTypes() {
  return PARTY_CONSTANTS.UESR_INBOX_MESSAGE_TYPES;
}

export function getFeatInboxMessageTypes() {
  return PARTY_CONSTANTS.FEAT_INBOX_MESSAGE_TYPES;
}

export function getGlobalInboxMessageTypes() {
  return PARTY_CONSTANTS.GLOBAL_INBOX_MESSAGE_TYPES;
}

export function getArchiveMessageTypes(contact) {
  if (isFeatContact(contact)) {
    return getFeatArchiveMessageTypes();
  }
  if (isGroupContact(contact)) {
    return getGroupArchiveMessageTypes();
  }
  return getUserArchiveMessageTypes();
}

export function getGroupArchiveMessageTypes() {
  return PARTY_CONSTANTS.GROUP_ARCHIVE_MESSAGE_TYPES;
}

export function getUserArchiveMessageTypes() {
  return PARTY_CONSTANTS.USER_ARCHIVE_MESSAGE_TYPES;
}

export function getFeatArchiveMessageTypes() {
  return PARTY_CONSTANTS.FEAT_ARCHIVE_MESSAGE_TYPES;
}

export function getGlobalArchiveMessageTypes() {
  return undefined;
}
