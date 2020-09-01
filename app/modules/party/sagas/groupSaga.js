import { takeEvery, call, put, select } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import ApiError from '@/errors/ApiError';
import { formatMessage } from '@/services/intl';
import {
  contact as contactSchema,
  group as groupSchema,
  inboxMessage as messageSchema,
} from '@/schema';

import {
  createGroup as createGroupRequest,
  getContact as getContactRequest,
  addGroupMembers as addGroupMembersRequest,
  getGroupMembers as getGroupMembersRequest,
  removeGroupMember as removeGroupMemberRequest,
  blackGroup as blackGroupRequest,
  unblackGroup as unblackGroupRequest,
  dismissGroup as dismissGroupRequest,
  processGroupMergeRequest as processGroupMergeRequestApi,
  renameGroup as renameGroupRequest,
  restoreGroup as restoreGroupRequest,
  mergeGroup as mergeGroupRequest,
  getGroupAvatar as getGroupAvatarRequest,
} from '@/client/party';

import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';

import { selectCurrentUser } from '@/modules/auth/selectors';
import commonMessages from '@/messages/common';

import genGroupName from '../utils/genGroupName';
import { selectGroupById } from '../selectors';

import {
  createGroup,
  addGroupMembers,
  removeGroupMember,
  getGroupMembers,
  blackGroup,
  unblackGroup,
  dismissGroup,
  restoreGroup,
  renameGroup,
  postGroupMerge,
  acceptGroupMerge,
  rejectGroupMerge,
  fetchGroupAvatar,
} from '../actions';

import {
  CONTACT_TYPE_GROUP,
  GROUP_STATUS_DISMISS,
  GROUP_STATUS_REQUESTING_MERGE,
  GROUP_STATUS_CHECKING_MERGE,
} from '../constants';
import { alert as alertMessages } from '../messages';

function* createGroupAsync(action) {
  try {
    const contacts = action.payload;
    const currentUser = yield select(selectCurrentUser);
    const data = {
      name: genGroupName(currentUser, contacts),
      members: contacts.map((contact) => contact.friend),
    };
    const { data: group } = yield call(createGroupRequest, data);
    const {
      data: newContact,
    } = yield call(getContactRequest, {
      group: group.id,
    });
    // const newContact = createContactWithGroup(group);
    const normalized = normalize(newContact, contactSchema);
    yield put(
      createGroup.success({
        contactId: normalized.result,
        groupId: group.id,
        entities: normalized.entities,
      }),
    );
    notification.success({
      message: formatMessage(alertMessages.groupCreated),
      description: group.name,
    });
  } catch (err) {
    if (err.code && err.code === 'NOT_FOUND') {
      logging.error(err);
    } else {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      if (!(err instanceof ApiError)) {
        logging.error(err);
      }
    }
    

    yield put(createGroup.failure(err));
  }
}

function* addGroupMembersAsync(action) {
  const { groupId, contactId, members, type } = action.payload;
  try {
    const { data: newMembers } = yield call(addGroupMembersRequest, {
      groupId,
      members,
    });
    const entityMutators = [
      {
        [groupSchema.key]: {
          [groupId]: {
            members: {
              $set: newMembers,
            },
          },
        },
      },
    ];
    yield put(
      addGroupMembers.success({
        groupId,
        contactId,
        entityMutators,
      }),
    );

    if (type === 'restore') {
      message.success(formatMessage(alertMessages.restoreMemberSuccess));
    } else {
      message.success(formatMessage(alertMessages.addGroupMemberSuccess));
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      addGroupMembers.failure({
        groupId,
        contactId,
        error: err,
      }),
    );
  }
}

function* getGroupMembersAsync(action) {
  const { roomId, groupId } = action.payload;
  try {
    const { data: members } = yield call(getGroupMembersRequest, groupId);
    const entityMutators = [
      {
        [groupSchema.key]: {
          [groupId]: {
            'members': {
              $set: members,
            },
          },
        },
      },
    ];
    yield put(getGroupMembers.success({ roomId, groupId, entityMutators }));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      getGroupMembers.failure({
        roomId,
        groupId,
        error: err,
      }),
    );
  } finally {
    yield put(
      getGroupMembers.fulfill({
        roomId,
        groupId,
      }),
    );
  }
}

function* removeGroupMemberAsync(action) {
  try {
    const { roomId, groupId, userId } = action.payload;
    yield call(removeGroupMemberRequest, {
      groupId,
      userId,
    });

    const entityMutators = [
      {
        [groupSchema.key]: {
          [groupId]: {
            'members': (list) => list.map((item) => item.user === userId ? ({
              ...item,
              is_removed: true,
            }) : item),
          },
        },
      },
    ];

    yield put(
      removeGroupMember.success({
        roomId,
        groupId,
        entityMutators,
      }),
    );
    message.success(formatMessage(alertMessages.removeGroupMemberSuccess))
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      removeGroupMember.failure({
        roomId: action.payload.roomId,
        data: err,
      }),
    );
  }
}

function* blackGroupAsync(action) {
  const { groupId, contactId } = action.payload;
  try {
    const { data: contact } = yield call(blackGroupRequest, groupId);
    const normalized = normalize(contact, contactSchema);
    yield put(
      blackGroup.success({
        groupId,
        contactId: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      blackGroup.failure({
        groupId,
        contactId,
        error: err,
      }),
    );
  }
}

function* unblackGroupAsync(action) {
  const { groupId, contactId } = action.payload;
  try {
    const { data: contact } = yield call(unblackGroupRequest, groupId);
    const normalized = normalize(contact, contactSchema);
    yield put(
      unblackGroup.success({
        groupId,
        contactId,
        entities: normalized.entities,
      }),
    );
    if (action.payload.nextAction) {
      yield put(action.payload.nextAction);
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      unblackGroup.failure({
        groupId,
        contactId,
        error: err,
      }),
    );
  }
}

function* dismissGroupAsync(action) {
  const { groupId, contactId } = action.payload;
  try {
    const { data: group } = yield call(dismissGroupRequest, groupId);
    yield put(
      dismissGroup.success({
        contactId,
        groupId,
        entityMutators: [
          {
            [groupSchema.key]: {
              [groupId]: {
                'status': {$set: group.status},
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      dismissGroup.failure({
        contactId,
        groupId,
        error: err,
      }),
    );
  }
}

function* acceptGroupMergeAsync(action) {
  try {
    const { payload: msg } = action;
    const { detail } = msg;
    const { data: group } = yield call(processGroupMergeRequestApi, {
      groupId: detail.target_group,
      requestId: detail.request_id,
      isApprove: true,
    });
    // update message
    yield put(
      acceptGroupMerge.success({
        groupId: detail.target_group,
        entities: {
          [groupSchema.key]: {
            [group.id]: group,
          },
        },
        entityMutators: [
          {
            [messageSchema.key]: {
              [msg.id]: {
                detail: (d) => ({
                  ...d,
                  is_handled: true,
                  is_approve: true,
                }),
              },
            },
          },
        ],
      }),
    );
    notification.success({
      message: formatMessage(alertMessages.addGroupMemberSuccess),
    });
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

function* rejectGroupMergeAsync(action) {
  try {
    const { payload: msg } = action;
    const { detail } = msg;
    const { data: group } = yield call(processGroupMergeRequestApi, {
      groupId: detail.target_group,
      requestId: detail.request_id,
      isApprove: false,
    });

    yield put(
      rejectGroupMerge.success({
        roomId: `${CONTACT_TYPE_GROUP}_${detail.target_group}`,
        entities: {
          [groupSchema.key]: {
            [group.id]: group,
          },
        },
        entityMutators: [
          {
            [messageSchema.key]: {
              [msg.id]: {
                'detail': (d) => ({
                  ...d,
                  is_handled: true,
                  is_approve: false,
                }),
              },
            },
          },
        ],
      }),
    );
    notification.success({
      title: formatMessage(commonMessages.requestSucceeded),
      description: formatMessage(alertMessages.groupMergeRejected),
    });
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  }
}

function* restoreGroupAsync(action) {
  const { groupId, contactId } = action.payload;
  try {
    const { data: group } = yield call(restoreGroupRequest, groupId);
    const normalized = normalize(group, groupSchema);
    yield put(
      restoreGroup.success({
        contactId: action.payload.contactId,
        groupId: normalized.result,
        entities: normalized.entities,
      }),
    );
    notification.success({
      message: formatMessage(alertMessages.groupRestored),
    });
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      restoreGroup.failure({
        contactId,
        groupId,
        error: err,
      }),
    );
  }
}

function* postGroupMergeAsync(action) {
  try {
    yield call(mergeGroupRequest, action.payload);
    const sourceGroup = yield select((state) =>
      selectGroupById(state, action.payload.sourceGroupId),
    );
    const targetGroup = yield select((state) =>
      selectGroupById(state, action.payload.targetGroupId),
    );
    let updatedSourceGroup;
    let updatedTargetGroup;
    if (action.payload.userIsOwnerOfBoth) {
      updatedSourceGroup = {
        ...sourceGroup,
        is_valid: false,
        status: GROUP_STATUS_DISMISS,
      };
      updatedTargetGroup = {
        ...targetGroup,
        members: undefined,
      };
    } else {
      // update sourceContact;
      updatedSourceGroup = {
        ...sourceGroup,
        status: GROUP_STATUS_REQUESTING_MERGE,
      };

      updatedTargetGroup = {
        ...targetGroup,
        status: GROUP_STATUS_CHECKING_MERGE,
      };
    }
    yield put(
      postGroupMerge.success({
        ...action.payload,
        entities: {
          groups: {
            [updatedSourceGroup.id]: updatedSourceGroup,
            [updatedTargetGroup.id]: updatedTargetGroup,
          },
        },
      }),
    );
    // const normalized = normalize(data, contactSchema);
    // yield put(mergeGroupSuccess(normalized));
  } catch (error) {
    yield put(postGroupMerge.failure(error));
  }
}

function* renameGroupAsync(action) {
  const { roomId, groupId } = action.payload;
  try {
    const { data: group } = yield call(renameGroupRequest, action.payload);
    const normalized = normalize(group, groupSchema);
    yield put(
      renameGroup.success({
        roomId,
        groupId: normalized.groupId,
        entities: normalized.entities,
      }),
    );
  } catch (error) {
    yield put(
      renameGroup.failure({
        roomId,
        groupId,
        error,
      }),
    );
    notification.error({
      message: 'Error',
      description: error.message,
    });
  } finally {
    yield put(
      renameGroup.fulfill({
        roomId,
        groupId,
      }),
    );
  }
}

function* fetchGroupAvatarAsync(action) {
  const { payload } = action;
  try {
    const res = yield call(getGroupAvatarRequest, payload.id);
    const base64Link = window.URL.createObjectURL(res);
    yield put(
      fetchGroupAvatar.success({
        entityMutators: [
          {
            [groupSchema.key]: {
              [payload.id]: {
                'avatar': {
                  $set: base64Link,
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(fetchGroupAvatar.failure(payload));
  }
}

export default function* groupSaga() {
  yield takeEvery(createGroup, createGroupAsync);
  yield takeEvery(addGroupMembers, addGroupMembersAsync);
  yield takeEvery(removeGroupMember, removeGroupMemberAsync);
  yield takeEvery(getGroupMembers, getGroupMembersAsync);
  yield takeEvery(blackGroup, blackGroupAsync);
  yield takeEvery(unblackGroup, unblackGroupAsync);
  yield takeEvery(dismissGroup, dismissGroupAsync);
  yield takeEvery(restoreGroup, restoreGroupAsync);
  yield takeEvery(renameGroup, renameGroupAsync);

  yield takeEvery(postGroupMerge, postGroupMergeAsync);
  yield takeEvery(acceptGroupMerge, acceptGroupMergeAsync);
  yield takeEvery(rejectGroupMerge, rejectGroupMergeAsync);

  yield takeEvery(fetchGroupAvatar, fetchGroupAvatarAsync);
}
