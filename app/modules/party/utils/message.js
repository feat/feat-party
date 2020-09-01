import { MESSAGE_TYPE_GROUP_RENAME } from '../constants';

export const shouldNotify = (messageType) =>
  messageType !== MESSAGE_TYPE_GROUP_RENAME;

export const getMaxId = (list) =>
  [...list].sort((a, b) => {
    if (b instanceof Object) {
      return -1;
    }
    if (a instanceof Object) {
      return 1;
    }
    return b - a;
  })[0];

export const getMinId = (list) =>
  [...list].sort((a, b) => {
    if (b instanceof Object) {
      return -1;
    }
    if (a instanceof Object) {
      return 1;
    }
    return a - b;
  })[0];

export const generateId = (roomId) => `${roomId}_${Date.now()}`;
