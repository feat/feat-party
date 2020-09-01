import { defineMessages } from '@/services/intl';

import {
  ORDER_STATUS_CREATED,
  ORDER_STATUS_PAID,
  // ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  // ORDER_STATUS_TO_START,
  // ORDER_STATUS_FOR_PROVIDER_TO_START,
  // ORDER_STATUS_FOR_CONSUMER_TO_START,
  // ORDER_STATUS_ON_AIR,
  // ORDER_STATUS_FINISHED,
  ORDER_STATUS_WAITING_FOR_REFUND,
  // ORDER_STATUS_WAITING_FOR_ARBITRATION,
  // ORDER_STATUS_REFUNDING,
  ORDER_STATUS_FUNDING,
  ORDER_STATUS_FULFILL,
} from '@/modules/commerce/constants';

import {
  MESSAGE_COLLABORATOR_OWNER,
  MESSAGE_COLLABORATOR_ADMIN,
  MESSAGE_COLLABORATOR_PARTICIPATOR,
} from './constants';

export default defineMessages({
  consultLabel: {
    id: 'party.consult-button.label',
    defaultMessage: 'Consult',
  },
  inbox: {
    id: 'party.ui.inbox',
    defaultMessage: 'Inbox',
  },
  archive: {
    id: 'party.ui.archive',
    defaultMessage: 'Archive',
  },

  contactHasLeft: {
    id: 'party.contact.has-left-label',
    defaultMessage: 'Left',
  },

  dropAndSendFriendRequestHint: {
    id: 'party.ui.drop-and-send-friend-request-hint',
    defaultMessage: 'Release and send friend request.',
  },

  broadcast: {
    id: 'party.ui.broadcast-message',
    defaultMessage: 'Broadcast Message. Press [Enter] to send.',
  },

  writeHere: {
    id: 'party.ui.write-here',
    defaultMessage: 'Write Here. Press [Enter] to send message.',
  },
  removeUserTitle: {
    id: 'party.alert.remove-user.title',
    defaultMessage: 'Remove User',
  },
  removeUserContent: {
    id: 'party.alert.remove-user.content',
    defaultMessage: 'Confirm to Block User.',
  },
  restore: {
    id: 'party.ui.restore',
    defaultMessage: 'restore',
  },
  roomSearchPlaceholder: {
    id: 'party.ui.archive-header-search',
    defaultMessage: 'Search',
  },
  dateFilterPlaceholder: {
    id: 'party.ui.date-filter-placeholder',
    defaultMessage: 'From date',
  },
  queryLabel: {
    id: 'party.ui.query',
    defaultMessage: 'Query',
  },
  resetLabel: {
    id: 'party.ui.reset',
    defaultMessage: 'Reset',
  },
  contact: {
    id: 'party.ui.contact',
    defaultMessage: 'Contact',
  },
  group: {
    id: 'party.ui.group',
    defaultMessage: 'Group',
  },
});

export const about = defineMessages({
  about: {
    id: 'party.about.about',
    defaultMessage: 'About ©',
  },
  name: {
    id: 'party.about.name',
    defaultMessage: 'Party',
  },
  version: {
    id: 'party.about.version',
    defaultMessage: 'Version: {version}',
  },
  author: {
    id: 'party.about.author',
    defaultMessage: 'Author: Kaizhen Wang',
  },
  copyright: {
    id: 'party.about.copyright',
    defaultMessage: 'Copyright © 2010--{year} Feat Inc.',
  },
  reserved: {
    id: 'party.about.copyright-reserved',
    defaultMessage: 'All rights reserved.',
  },
});

export const alert = defineMessages({
  confirmLabel: {
    id: 'party.alert.confirm-label',
    defaultMessage: 'Confirm',
  },
  noticeLabel: {
    id: 'party.alert.notice-label',
    defaultMessage: 'Note',
  },
  infoLabel: {
    id: 'party.alert.info-label',
    defaultMessage: 'Info',
  },
  notAllowedLabel: {
    id: 'party.alert.not-allowed',
    defaultMessage: 'Not Allowed',
  },
  blackUserConfirm: {
    id: 'party.alert.black-user-confirm',
    defaultMessage: 'Wanna Black User?',
  },
  dismissGroupConfirm: {
    id: 'party.alert.dismiss-group-confirm',
    defaultMessage: 'Wanna Dismiss Group?',
  },
  blackGroupConfirm: {
    id: 'party.alert.black-group-confirm',
    defaultMessage: 'Wanna Block Group?',
  },
  userHasJoinedGroup: {
    id: 'party.alert.user-has-joined-group',
    defaultMessage: 'User {username} has joined group.',
  },
  mergeGroupConfirm: {
    id: 'party.alert.merge-group-confirm',
    defaultMessage:
      'Merge your group ({sourceGroup}) into group: ({targetGroup}) ?',
  },
  invalidGroupName: {
    id: 'party.alert.invalid-group-name',
    defaultMessage: 'Invalid group name',
  },
  maxLengthOfGroupName: {
    id: 'party.alert.max-length-of-group-name',
    defaultMessage: 'Max length of group name is {maxLength}',
  },
  groupRestoreHintForCreator: {
    id: 'party.alert.group-restore-hint-for-creator',
    defaultMessage:
      'Group has been dismissed. You may restored the group before sending message.',
  },
  groupRestoreHint: {
    id: 'party.alert.group-restore-hint',
    defaultMessage: 'Group has been dismissed.',
  },
  unblackGroupNotice: {
    id: 'party.alert.unblack-group-notice',
    defaultMessage:
      'You have blacked this group. Click "OK" to unblack group, before sending messages.',
  },
  unblackUserNotice: {
    id: 'party.alert.unblack-user-notice',
    defaultMessage:
      'Wanna send message to blacked user? Please unblack user first.',
  },
  unblackUserConfirm: {
    id: 'party.alert.unblack-user-confirm',
    defaultMessage: 'Wanna Unblack User?',
  },
  groupCantRestore: {
    id: 'party.alert.group-cant-be-restored',
    defaultMessage: 'Group cannot be restored.',
  },
  restoreGroupConfirm: {
    id: 'party.alert.restore-group-confirm',
    defaultMessage: 'Wanna retore group?',
  },
  unblackGroupConfirm: {
    id: 'party.alert.unblack-group-confirm',
    defaultMessage: 'Wanna Unblack Group?',
  },
  groupCreated: {
    id: 'party.alert.group-created',
    defaultMessage: 'Group created',
  },
  addGroupMemberSuccess: {
    id: 'party.alert.add-group-member-success',
    defaultMessage: 'Successfully added group members.',
  },
  restoreMemberSuccess: {
    id: 'party.alert.restore-member-success',
    defaultMessage: 'Successfully restore group member',
  },
  removeGroupMemberSuccess: {
    id: 'party.alert.remove-member-success',
    defaultMessage: 'Successfully remove group member',
  },
  groupMergeAccepted: {
    id: 'party.alert.group-merge-accepted',
    defaultMessage: 'Group merge accepted.',
  },
  groupMergeRejected: {
    id: 'party.alert.group-merge-rejected',
    defaultMessage: 'Group merge rejected',
  },
  groupRestored: {
    id: 'party.alert.group-restored',
    defaultMessage: 'Group restored',
  },
});

export const uiNav = defineMessages({
  party: {
    id: 'party.ui-nav.party',
    defaultMessage: 'Party',
  },
  chat: {
    id: 'party.ui-nav.chat',
    defaultMessage: 'Chat',
  },
});

export const token = defineMessages({
  firstPersonSubject: {
    id: 'party.message-token.first-person-subject',
    defaultMessage: 'I',
  },
  firstPersonObject: {
    id: 'party.message-token.first-person-object',
    defaultMessage: 'me',
  },
  secondPersonSubject: {
    id: 'party.message-token.second-person-subject',
    defaultMessage: 'you',
  },
  secondPersonObject: {
    id: 'party.message-token.second-person-object',
    defaultMessage: 'you',
  },
});

export const messages = defineMessages({
  broadcast: {
    id: 'party.messages.broadcast',
    defaultMessage: '{subject} broadcast: ',
  },
  normal: {
    id: 'party.messages.normal',
    defaultMessage: '{sender} ',
  },
  targeted: {
    id: 'party.messages.targeted',
    defaultMessage: '{sender} ›› {receiver} ',
  },
  groupMemberLeft: {
    id: 'party.messages.group-member-left',
    defaultMessage: '{username} left the chat room',
  },
  groupMemberRejoined: {
    id: 'party.messages.group-member-rejoined',
    defaultMessage: '{username} rejoin the chat room',
  },
  groupCreated: {
    id: 'party.messages.group-created',
    defaultMessage: 'New Group: { groupName }',
  },
  groupNewMember: {
    id: 'party.messages.group-new-member',
    defaultMessage: 'New Member: {username}',
  },
  groupRenamed: {
    id: 'party.messages.group-renamed',
    defaultMessage: 'New Group Name: {groupName}',
  },
  groupDismissed: {
    id: 'party.messages.group-dismissed',
    defaultMessage: 'The chat room {groupName} has been dismissed.',
  },
  groupRestored: {
    id: 'party.messages.group-restored',
    defaultMessage: 'The chat room {groupName} has been restored.',
  },
  groupMemberRemoved: {
    id: 'party.messages.group-member-removed',
    defaultMessage: '{username} removed.',
  },
  groupMemberRestored: {
    id: 'party.messages.group-member-restored',
    defaultMessage: '{username} restored.',
  },
  provider: {
    id: 'party.messages.provider',
    defaultMessage: 'Provider:',
  },
  consumer: {
    id: 'party.messages.consumer',
    defaultMessage: 'Consumer:',
  },
  orderError: {
    id: 'party.messages.order-error',
    defaultMessage: 'Order service error',
  },
  receivingAccountMissing: {
    id: 'party.messages.receiving-account-missing',
    defaultMessage: 'Receiving account missing',
  },
  failedToSend: {
    id: 'party.messages.failed-to-send',
    defaultMessage: 'Failed to send',
  },
});

export const groupMerge = defineMessages({
  mergeRequest: {
    id: 'party.messages.group-merge-request',
    defaultMessage:
      '{username} requests to merge group ({sourceGroup}) into group ({targetGroup})',
  },
  rejected: {
    id: 'party.messages.group-merge-request-rejected',
    defaultMessage:
      '{username} rejected to merge group ({sourceGroup}) into group ({targetGroup}).',
  },
});

export const friendRequest = defineMessages({
  posted: {
    id: 'party.messages.friend-request-posted',
    defaultMessage: '{subject} request to be friend with {object}',
  },
  accepted: {
    id: 'party.messages.friend-request-accepted',
    defaultMessage: '{subject} agreed to be friend with {object}.',
  },
  rejected: {
    id: 'party.messages.friend-request-rejected',
    defaultMessage: '{subject} refused to be friend with {object}.',
  },
  recalled: {
    id: 'party.messages.friend-request-recalled',
    defaultMessage: '{subject} recall a friend request.',
  },
});

export const groupStatusHint = defineMessages({
  requestingMerge: {
    id: 'party.group-status.requesting-merge',
    defaultMessage: '[requesting merge]',
  },
  checkingMerge: {
    id: 'party.group-status.checking-merge',
    defaultMessage: '[checking merge]',
  },
});

export const friendRequestStatus = defineMessages({
  recalled: {
    id: 'party.friend-request-status.recalled',
    defaultMessage: 'Recalled',
  },
  rejected: {
    id: 'party.friend-request-status.rejected',
    defaultMessage: 'Rejected',
  },
  accepted: {
    id: 'party.friend-request-status.accepted',
    defaultMessage: 'Accepted',
  },
  invalid: {
    id: 'party.friend-request-status.invalid',
    defaultMessage: 'Invalid',
  },
});

export const groupMergeRequestStatus = defineMessages({
  approved: {
    id: 'party.group-merge-request-status.approved',
    defaultMessage: 'Approved',
  },
  rejected: {
    id: 'party.group-merge-request-status.rejected',
    defaultMessage: 'Rejected',
  },
  invalid: {
    id: 'party.group-merge-request-status.invalid',
    defaultMessage: 'Invalid',
  },
});

export const order = defineMessages(
  {
    [ORDER_STATUS_CREATED]: {
      id: 'party.messages.order-create',
      defaultMessage: 'Order: {orderName} created.',
    },
    [ORDER_STATUS_PAID]: {
      id: 'party.messages.order-pay',
      defaultMessage: 'Order: {orderName} paid.',
    },
    [ORDER_STATUS_CONFIRMED]: {
      id: 'party.messages.order-accept',
      defaultMessage: 'Order: {orderName} accepted',
    },
    [ORDER_STATUS_CANCELED]: {
      id: 'party.messages.order-cancel',
      defaultMessage: 'Order: {orderName} canceled',
    },
    consumerBusy: {
      id: 'party.messages.order-consumer-busy',
      defaultMessage: 'Order: {orderName} consumer is busy.',
    },
    providerBusy: {
      id: 'party.messages.order-provider-busy',
      defaultMessage: 'Order: {orderName} provider is busy.',
    },
    // confirmFinished: {
    //   id: 'party.messages.order-confirm-finished',
    //   defaultMessage: 'Order: {orderName} finish confirmed',
    // },
    // confirmRefund: {
    //   id: 'party.messages.order-refund-confirmed',
    //   defaultMessage: 'Order: {orderName} refund confirmed',
    // },
    // confirmStart: {
    //   id: 'party.messages.order-confirm-start',
    //   defaultMessage: 'Order: {orderName} start confirmed',
    // },
    [ORDER_STATUS_FUNDING]: {
      id: 'party.messages.order-fund',
      defaultMessage: 'Order: {orderName} fund started',
    },
    [ORDER_STATUS_WAITING_FOR_REFUND]: {
      id: 'party.messages.order-refund',
      defaultMessage: 'Order: {orderName} refund requested',
    },
    // reject: {
    //   id: 'party.messages.order-reject',
    //   defaultMessage: 'Order: {orderName} rejected',
    // },
    // rejectRefund: {
    //   id: 'party.messages.order-reject-refund',
    //   defaultMessage: 'Order: {orderName} refund rejected',
    // },
    // start: {
    //   id: 'party.messages.order-start',
    //   defaultMessage: 'Order: {orderName} start triggered',
    // },
    // markAsExpired: {
    //   id: 'party.messages.mark-as-expired',
    //   defaultMessage: 'Order: {orderName} has expired.',
    // },
    [ORDER_STATUS_FULFILL]: {
      id: 'party.messages.order-fulfilled',
      defaultMessage: 'Order: {orderName} fulfilled',
    },
    fallback: {
      id: 'party.messages.order-updated',
      defaultMessage: 'Order {orderName} updated: {status}.',
    },
  },
  { prefix: 'Party Message of Order', shouldLog: false },
);

export const commentHeader = defineMessages({
  create: {
    id: 'party.messages-header.comment-created',
    defaultMessage: '{username} comments on {entityType}--{entity}',
  },
  update: {
    id: 'party.messages-header.comment-updated',
    defaultMessage: '{username} updates comment on {entityType}--{entity}',
  },
  delete: {
    id: 'party.messages-header.comment-deleted',
    defaultMessage: '{username} deletes comment on {entityType}--{entity}',
  },
});

export const like = defineMessages({
  liked: {
    id: 'party.messages.liked',
    defaultMessage: '{username} like your {entityType}--{entity}',
  },
  unliked: {
    id: 'party.messages.unliked',
    defaultMessage: '{username} unlike your {entityType}--{entity}',
  },
});

export const rewordingComment = defineMessages({
  comment: {
    id: 'party.rewording-comment.comment',
    defaultMessage: '{username} commented on {structure}',
  },
  shortMessage: {
    id: 'party.rewording-comment.short-message',
    defaultMessage: '{username} posts a comment',
  },
  viewDraft: {
    id: 'party.rewording-comment.view-draft',
    defaultMessage: 'View draft ›› ',
  },
});

export const rewordingLike = defineMessages({
  header: {
    id: 'party.rewording-comment.like',
    defaultMessage: '{username} like {structure}',
  },
});

export const rewordingAudit = defineMessages({
  reject: {
    id: 'party.rewording-audit.reject',
    defaultMessage: 'A rewording of {structure} has been rejected.',
  },
  elect: {
    id: 'party.rewording-audit.elect',
    defaultMessage: 'A rewording of {structure} has been elected.',
  },
});

export const shortAudit = defineMessages({
  reject: {
    id: 'party.short-audit.reject',
    defaultMessage: 'A rewording has been rejected.',
  },
  elect: {
    id: 'party.short-audit.elect',
    defaultMessage: 'A rewording has been elected.',
  },
});

export const rewordingSubmit = defineMessages({
  label: {
    id: 'party.rewording-submit.label',
    defaultMessage: 'New rewording',
  },
  message: {
    id: 'party.rewording-submit.message',
    defaultMessage: '{username} submitted a new rewording of {structure}',
  },
});

// 文章参与者
export const role = defineMessages({
  [MESSAGE_COLLABORATOR_OWNER]: {
    id: 'party.draft.owner',
    defaultMessage: 'Owner',
  },
  [MESSAGE_COLLABORATOR_ADMIN]: {
    id: 'party.draft.admin',
    defaultMessage: 'Admin',
  },
  [MESSAGE_COLLABORATOR_PARTICIPATOR]: {
    id: 'party.draft.participator',
    defaultMessage: 'Participator',
  },
});

// 系统消息弹窗
export const notification = defineMessages(
  {
    broadcast: {
      id: 'party.notification.broadcast',
      defaultMessage: '{username} broadcast: {content}',
    },
    groupIm: {
      id: 'party.notification.group-im',
      defaultMessage: '{fromUsername}: {content}',
    },
    groupPm: {
      id: 'party.notification.group-pm',
      defaultMessage: `{fromUsername} @ {toUsername}: {content}`,
    },
    newGroup: {
      id: 'party.notification.new-group',
      defaultMessage: 'New Group: {groupName}',
    },
    groupRenamed: {
      id: 'party.notification.group-renamed',
      defaultMessage: 'New Group Name: { groupName }',
    },
    newGroupMembers: {
      id: 'party.notification.new-group-members',
      defaultMessage: 'New Group Members: {members}',
    },
    groupMemberLeft: {
      id: 'party.notification.group-member-left',
      defaultMessage: '{username} left group.',
    },
    groupMemberRejoined: {
      id: 'party.notification.group-member-rejoined',
      defaultMessage: '{username} rejoined group.',
    },
    groupDismissed: {
      id: 'party.notification.group-dismissed',
      defaultMessage: 'Group ({groupName}) dismissed',
    },
    groupRestored: {
      id: 'party.notification.group-restored',
      defaultMessage: 'Group ({groupName}) restored',
    },
    groupMergeRequest: {
      id: 'party.notification.group-merge-request',
      defaultMessage:
        '{sourceGroupCreator} request to merge group ({sourceGroup}) into group ({targetGroup})',
    },
    friendRequest: {
      id: 'party.notification.friend-request',
      defaultMessage: 'Friend request from {username}',
    },
    friendRequestAccepted: {
      id: 'party.notification.friend-request-accepted',
      defaultMessage: '{username} accepted your friend request.',
    },
    friendRequestRejected: {
      id: 'party.notification.friend-request-rejected',
      defaultMessage: '{username} rejected your friend request.',
    },
    friendRequestRecalled: {
      id: 'party.notification.friend-request-recalled',
      defaultMessage: '{username} recalled a request.',
    },
    siteName: {
      id: 'party.notification.site-name',
      defaultMessage: 'Feat.com',
    },
    generalTitle: {
      id: 'party.notification.general-title',
      defaultMessage: 'Message',
    },
    orderCreated: {
      id: 'party.notification.order-created',
      defaultMessage: 'New Order ({ orderName }) Received.',
    },
    orderPaid: {
      id: 'party.notification.order-paied',
      defaultMessage: 'Order ({orderName}) Paied.',
    },
    orderCanceled: {
      id: 'party.notification.order-canceled',
      defaultMessage: 'Order ({orderName}) Canceled',
    },
    orderCancelling: {
      id: 'party.notification.order-cancelling',
      defaultMessage: 'Order ({orderName}) cancelling.',
    },
    orderRejected: {
      id: 'party.notification.order-rejected',
      defaultMessage: 'Order ({orderName}) Rejected',
    },
    orderAccepted: {
      id: 'party.notification.order-accepted',
      defaultMessage: 'Order ({orderName}) Accepted',
    },
    orderToStart: {
      id: 'party.notification.order-to-start',
      defaultMessage: 'Order ({orderName}) is ready to start.',
    },
    orderFinished: {
      id: 'party.notification.order-finished',
      defaultMessage: 'Order ({orderName}) Finsished',
    },
    orderFinishConfirmed: {
      id: 'party.notification.order-finish-confirmed',
      defaultMessage: 'Order ({orderName}) Finished',
    },
    orderStartTriggered: {
      id: 'party.notification.order-start-triggered',
      defaultMessage: 'Order ({orderName}) Start Triggered',
    },
    orderStartConfirmed: {
      id: 'party.notification.order-start-confirmed',
      defaultMessage: 'Order ({orderName}) Start Confirmed',
    },
    orderPause: {
      id: 'party.notification.order-pause',
      defaultMessage: 'Order ({orderName}) Pause',
    },
    orderFund: {
      id: 'party.notification.order-fund',
      defaultMessage: 'Order ({orderName}) is Funding.',
    },
    orderRefundRequested: {
      id: 'party.notification.order-refund-requested',
      defaultMessage: '{consumer} reqeusted to refund.',
    },
    orderRefundConfirmed: {
      id: 'party.notification.order-refund-confirmed',
      defaultMessage: '{provider} confirmed to refund.',
    },
    orderRefundCanceled: {
      id: 'party.notification.order-refund-canceled',
      defaultMessage: '{consumer} canceled to refund request.',
    },
    orderRefundRejected: {
      id: 'party.notification.order-refund-rejected',
      defaultMessage: '{provider} rejected to refund.',
    },
    orderExpired: {
      id: 'party.notification.order-expired',
      defaultMessage: 'Order ({orderName}) has expired',
    },
    orderFulfilled: {
      id: 'party.notification.order-fulfilled',
      defaultMessage: 'Order ({orderName}) has fulfilled.',
    },
    orderStatusUpdated: {
      id: 'party.notification.order-status-updated',
      defaultMessage: 'Order ({orderName}) status updated.',
    },
    rewordingCommented: {
      id: 'party.notification.rewording-commented',
      defaultMessage: '{username} posts a rewording comment',
    },
    rewordingLiked: {
      id: 'party.notification.rewording-liked',
      defaultMessage: '{username} likes a rewording.',
    },
    rewordingSubmitted: {
      id: 'party.notification.rewording-submitted',
      defaultMessage: 'New rewording submitted',
    },
    rewordingRejected: {
      id: 'party.notification.rewording-rejected',
      defaultMessage: 'A rewording has been rejected',
    },
    rewordingElected: {
      id: 'party.notification.rewording-elected',
      defaultMessage: 'A rewording has been elected',
    },
    collaboratorJoin: {
      id: 'party.notification.collaborator-join',
      defaultMessage: '{username} join the group as {identity}',
    },
    collaboratorChange: {
      id: 'party.notification.collaborator-change',
      defaultMessage: '{username} become {identity}',
    },
    collaboratorRemoved: {
      id: 'party.notification.collaborator-leave',
      defaultMessage: '{username} removed',
    },
    orderError: {
      id: 'party.notification.order-error',
      defaultMessage: 'Order service error',
    },
    receivingAccountMissing: {
      id: 'party.notification.receiving-account-missing',
      defaultMessage: 'Receiving account missing.',
    },
  },
  {
    prefix: 'party notification: ',
  },
);
