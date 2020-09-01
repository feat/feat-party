import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import get from 'lodash/get';
import { stringify } from 'query-string';

import {
  contact as contactSchema,
  inboxMessage as inboxMessageSchema,
  archiveMessage as archiveMessageSchema,
  group as groupSchema,
  // user as userSchema,
} from '@/schema';

import tryToGetKey from '@/utils/tryToGetKey';

import { selectEntities } from '@/modules/entity/selectors';

import {
  CONTACT_TYPE_USER,
  CONTACT_TYPE_GROUP,
  CONTACT_TYPE_FEAT,
} from './constants';

import { initialSubState as initialInfoState } from './reducers/roomInfo';
import { initialSubState as initialInboxState } from './reducers/roomInbox';
import {
  initialSubState as initialArchiveState,
  initialQueryState as initialArchiveQueryState,
} from './reducers/roomArchive';

export const selectUiState = (state) => get(state, ['party', 'ui'], {});
export const selectPartyIsOpened = (state) => {
  const uiState = selectUiState(state);
  return uiState.display;
};
export const selectCurrentRoomId = (state) => {
  const uiState = selectUiState(state);
  return uiState.currentRoom;
};
export const selectCurrentTab = (state) => {
  const uiState = selectUiState(state);
  return uiState.currentTab;
};

export const selectCurrentRoomInfo = (state) => {
  const currentRoom = selectCurrentRoomId(state);
  return get(state, ['party', 'rooms', currentRoom, 'info']);
};

export const selectRequests = (state) => get(state, ['party', 'requests']);
export const selectRoomStates = (state) => get(state, ['party', 'rooms']);
export const selectInboxContactList = (state) =>
  get(state, ['party', 'inboxContact', 'list'], []);
export const selectInboxContactFetched = (state) =>
  get(state, ['party', 'inboxContact', 'initFetched']);
export const selectArchiveContactList = (state) =>
  get(state, ['party', 'archiveContact', 'list'], []);

export const selectArchiveContactFetched = (state) =>
  get(state, ['party', 'archiveContact', 'initFetched']);

export const selectContactById = (state, id) => {
  const entities = selectEntities(state);
  return denormalize(id, contactSchema, entities);
};

export const selectRoomById = (state, roomId) =>
  get(state, ['party', 'rooms', roomId]);

export const selectGroupById = createSelector(
  (_, groupId) => groupId,
  selectEntities,
  (groupId, entityMap) => {
    if (!groupId) {
      return groupId;
    }
    return denormalize(groupId, groupSchema, entityMap);
  },
);

export const selectGroupMembers = createSelector(
  selectGroupById,
  (group) => group && group.members,
);

export const makeSelectGroupMembers = (id) =>
  createSelector(
    (state) => selectGroupById(state, id),
    (group) => group && group.members,
  );

export const selectContactByRoomId = (state, roomId) => {
  const [type, id] = roomId.split('_');
  const entityMap = state.entities;
  const contact = Object.values(entityMap[contactSchema.key]).find((item) => {
    if (type === CONTACT_TYPE_USER && item.friend === Number(id)) {
      return true;
    }
    if (type === CONTACT_TYPE_GROUP && Number(item.group) === Number(id)) {
      return true;
    }
    if (type === CONTACT_TYPE_FEAT) {
      return true;
    }
    return false;
  });

  if (!contact) {
    return null;
  }

  return denormalize(contact, contactSchema, entityMap);
};

export const selectCurrentContact = createSelector(
  (state) => {
    const roomId = selectCurrentRoomId(state);
    const roomInfo = selectRoomInfo(state, { roomId });
    return roomInfo && roomInfo.contactId;
  },
  selectEntities,
  (id, entityMap) => {
    if (!id) {
      return null;
    }
    return denormalize(id, contactSchema, entityMap);
  },
);

export const selectRoomInbox = (state, props) =>
  get(state, ['party', 'roomInbox', props.roomId], initialInboxState);

export const selectRoomArchive = (state, props) =>
  get(state, ['party', 'roomArchive', props.roomId], initialArchiveState);

export const selectRoomArchiveQuery = (state, props) => {
  const key = stringify(props.filter);
  return get(
    state,
    ['party', 'roomArchive', props.roomId, 'queries', key],
    initialArchiveQueryState,
  );
};

export const selectContactByUserId = (state, userId) => {
  const entityMap = state.entities;
  const contact = Object.values(entityMap[contactSchema.key]).find(
    (item) => item.friend === Number(userId),
  );
  if (!contact) {
    return null;
  }
  return denormalize(contact, contactSchema, entityMap);
};

export const getContactByGroupId = (state, groupId) =>
  Object.values(state.entities[contactSchema.key]).find(
    (item) => item.group === Number(groupId),
  );

export const selectContactIdByGroupId = (state, groupId) => {
  const contact = getContactByGroupId(state, groupId);
  if (!contact) {
    return null;
  }
  return contact.id;
};

export const selectContactByGroupId = (state, groupId) => {
  const contact = getContactByGroupId(state, groupId);
  if (!contact) {
    return null;
  }
  return denormalize(contact, contactSchema, state.entities);
};

export const selectUnreadMessageCount = createSelector(
  selectInboxContactList,
  (state) => get(state, ['entities', contactSchema.key]),
  (list, contactMap) => {
    if (!list) {
      return 0;
    }
    const totalUnreadCount = list.reduce((a, b) => {
      const unread = get(contactMap, [String(b), 'unread_count']);
      return a + (unread ? Number(unread) : 0);
    }, 0);
    return totalUnreadCount;
  },
);

export const selectInboxMessageIdsByRoomId = (state, roomId) => {
  const inbox = selectRoomInbox(state, { roomId });
  return inbox.messages;
};
export const selectInboxMessagesByRoomId = createSelector(
  selectInboxMessageIdsByRoomId,
  selectEntities,
  (list, entityMap) => denormalize(list, [inboxMessageSchema], entityMap),
);
export const selectArchiveMessageIdsByRoomId = (state, roomId) => {
  const archive = selectRoomArchive(state, { roomId });
  return archive.messages;
};

export const selectArchiveMessagesByRoomId = createSelector(
  selectArchiveMessageIdsByRoomId,
  selectEntities,
  (list, entityMap) => denormalize(list, [archiveMessageSchema], entityMap),
);

export const selectInboxMessageById = (state, messageId) =>
  get(state, ['entities', inboxMessageSchema.key, String(messageId)]);

export const selectArchiveMessageById = (state, messageId) =>
  get(state, ['entities', archiveMessageSchema.key, String(messageId)]);

export const selectInboxContactByGroupId = (state, groupId) => {
  const list = selectInboxContactList(state);
  const entities = selectEntities(state);
  const contacts = denormalize(list, [contactSchema], entities);
  const contact = contacts.find(
    (item) => get(item, ['group', 'id']) === groupId,
  );
  if (!contact) {
    return null;
  }
  return contact;
};

export const selectInboxContactByRoomId = (state, roomId) => {
  const list = selectInboxContactList(state);
  const entities = selectEntities(state);
  const contacts = denormalize(list, [contactSchema], entities);
  const [type, id] = roomId.split('_');
  const contact = contacts.find((item) => {
    if (!item) {
      logging.warn('invalid contact exits', {
        contacts,
        roomId,
      });
      return false;
    }
    if (type === CONTACT_TYPE_USER && item.friend === Number(id)) {
      return true;
    }
    if (
      type === CONTACT_TYPE_GROUP &&
      get(item, ['group', 'id']) === Number(id)
    ) {
      return true;
    }
    if (type === CONTACT_TYPE_FEAT && item.type === CONTACT_TYPE_FEAT) {
      return true;
    }
    return false;
  });
  if (!contact) {
    return null;
  }
  return contact;
};

export const selectCurrentContacts = (state) => {
  const currentTab = selectCurrentTab(state);
  return get(state, ['party', `${currentTab}Contact`]);
};

const contactSort = (a, b) => {
  if (b.stickToTop) {
    return 1;
  }
  if (a.stickToTop) {
    return -1;
  }
  return new Date(b.contact_time) - new Date(a.contact_time);
};

export const selectCurrentContactsState = createSelector(
  selectCurrentContacts,
  selectEntities,
  (contactState, entityMap) => {
    const list = denormalize(
      contactState.list,
      [contactSchema],
      entityMap,
    ).sort(contactSort);

    return {
      ...contactState,
      list,
    };
  },
);

export const selectInboxContacts = createSelector(
  (state) => get(state, ['party', 'inboxContact']),
  selectEntities,
  (subState, entityMap) => {
    const list = denormalize(subState.list, [contactSchema], entityMap).sort(
      contactSort,
    );

    return {
      ...subState,
      list,
    };
  },
);
export const selectArchiveContacts = createSelector(
  (state) => get(state, ['party', 'archiveContact']),
  selectEntities,
  (subState, entityMap) => {
    const list = denormalize(subState.list, [contactSchema], entityMap).sort(
      contactSort,
    );

    return {
      ...subState,
      list,
    };
  },
);

export const selectContacts = (state) =>
  get(state, ['entities', contactSchema.key]);

export const selectPartyNavSections = createSelector(
  selectCurrentContacts,
  selectEntities,
  (contactState, entityMap) => {
    if (!contactState) {
      return [];
    }
    return denormalize(contactState.list || [], [contactSchema], entityMap)
      .filter((item) => !!item.group)
      .sort((a, b) => {
        if (b.stickToTop) {
          return 1;
        }
        if (a.stickToTop) {
          return -1;
        }
        return new Date(b.contact_time) - new Date(a.contact_time);
      });
  },
);

export const selectPartySectionItemsForRoom = createSelector(
  (_, props) => props.roomId,
  selectCurrentContacts,
  selectEntities,
  (roomId, contactState, entityMap) => {
    if (!contactState) {
      return [];
    }
    const [contactType, entityId] = (roomId || '').split('_');
    const list = denormalize(
      contactState.list || [],
      [contactSchema],
      entityMap,
    );
    if (contactType === CONTACT_TYPE_GROUP) {
      const contact = list.find(
        (item) => String(get(item, ['group', 'id'])) === String(entityId),
      );
      if (!contact) {
        logging.warn('No related contact found');
      }
      return get(contact, ['group', 'members'], []);
    }
    return list.filter((item) => item.friend);
  },
);

export const selectRoomInfo = (state, props) =>
  get(state, ['party', 'roomInfo', props.roomId], initialInfoState);

export const selectRoomActiveFilter = createSelector(
  selectRoomInfo,
  (state) => state.activeFilter,
);

export const selectRoomInboxState = createSelector(
  selectRoomInbox,
  selectEntities,
  (inboxState, entityMap) => {
    const messages = denormalize(
      inboxState.messages,
      [inboxMessageSchema],
      entityMap,
    );
    return {
      ...inboxState,
      messages,
    };
  },
);

export const selectRoomContactId = (state, props) => {
  const info = selectRoomInfo(state, props);
  const roomId = tryToGetKey(props, 'roomId');
  return info.contactId || roomId || null;
};

export const selectRoomContact = createSelector(
  selectRoomContactId,
  selectEntities,
  (id, entityMap) => {
    if (!id) {
      return id;
    }
    return denormalize(id, contactSchema, entityMap);
  },
);

export const selectRoomArchiveState = createSelector(
  selectRoomArchive,
  selectEntities,
  (archiveState, entityMap) => {
    const messages = denormalize(
      archiveState.messages,
      [archiveMessageSchema],
      entityMap,
    );
    return {
      ...archiveState,
      messages,
    };
  },
);

export const makeSelectIsConsultButtonActive = (roomId) =>
  createSelector(
    selectUiState,
    (uiState) => uiState.display && uiState.currentRoom === roomId,
  );
