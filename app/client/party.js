import request from '@/utils/request';

/**
 * 获取 Inbox 联系人列表
 */
export const getInboxContacts = () =>
  request({
    url: '/api/party/contact-list/inbox/',
  });

/**
 * 获取 Archive 联系人列表
 */
export const getArchiveContacts = () =>
  request({
    url: '/api/party/contact-list/archive/',
  });

export const getContact = ({ user, group }) =>
  request({
    url: '/api/party/contact-list/get_contact/',
    method: 'GET',
    params: {
      user,
      group,
    },
  });

/**
 * 改变好友关系，仅针对用户
 * @param id [用户ID]
 * @param action ['apply', 'recall', 'accept', 'reject', 'black', 'unblack']
 * @returns {*}
 */
export const updateRelation = ({ userId, action }) =>
  request({
    url: '/api/party/contact-list/update_relation/',
    method: 'POST',
    data: {
      action,
      friend: userId,
    },
  });

/**
 * 发送好友申请
 * @param userId
 */
export const postFriendRequest = ({ userId }) =>
  updateRelation({ action: 'apply', userId });

/**
 * 撤回好友申请
 * @param userId
 */
export const recallFriendRequest = ({ userId }) =>
  updateRelation({ action: 'recall', userId });

/**
 * 接受好友申请
 * @param userId
 */
export const acceptFriendRequest = ({ userId }) =>
  updateRelation({ action: 'accept', userId });

/**
 * 拒绝好友申请
 * @param userId
 */
export const rejectFriendRequest = ({ userId }) =>
  updateRelation({ action: 'reject', userId });

/**
 * 拉黑用户
 * @param userId
 */
export const blackUser = ({ userId }) =>
  updateRelation({ action: 'black', userId });

/**
 * 取消拉黑用户
 * @param userId
 */
export const unblackUser = ({ userId }) =>
  updateRelation({ action: 'unblack', userId });

// Group
// ----------

/**
 * 当前用户所在的群
 * @returns Promise
 */
export const getGroups = () =>
  request({
    url: '/api/party/group/',
  });

/**
 * 创建群组
 * @param name
 * @param members
 * @returns Promise
 */
export const createGroup = ({ name, members }) =>
  request({
    url: '/api/party/group/',
    method: 'POST',
    data: {
      name,
      members,
    },
  });

export const renameGroup = ({ groupId, name }) =>
  request({
    url: `/api/party/group/${groupId}/rename/`,
    method: 'POST',
    data: {
      name,
    },
  });

/**
 * 添加群组成员
 * @param {Object} { id: groupId, members: Array<userId> }
 * @return {Promise}
 */
export const addGroupMembers = ({ groupId, members }) =>
  request({
    url: `/api/party/group/${groupId}/add_member/`,
    method: 'POST',
    data: {
      members,
    },
  });

/**
 * 获取群组成员
 * @param  {string} groupId 群组ID
 * @return {Promise}         [description]
 */
export const getGroupMembers = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/get_member/`,
  });

/**
 * 获取用户头像
 *
 * @param groupId
 * @returns Promise
 */
export const getGroupAvatarUrl = (groupId) =>
  `/api/party/group/${groupId}/get_avatar/`;

export const getGroupAvatar = (groupId) =>
  request({
    url: getGroupAvatarUrl(groupId),
    method: 'GET',
    responseType: 'blob',
  });

/**
 * 剔除群组成员
 * @param id
 * @param userId
 * @returns {*}
 */
export const removeGroupMember = ({ groupId, userId }) =>
  request({
    url: `/api/party/group/${groupId}/remove_member/`,
    method: 'POST',
    data: {
      uid: userId,
    },
  });

/**
 * 请求合并群组
 * @param sourceGroupId
 * @param targetGroupId
 * @returns {*}
 */
export const mergeGroup = ({ sourceGroupId, targetGroupId }) =>
  request({
    url: `/api/party/group/${sourceGroupId}/merge_request/`,
    method: 'POST',
    data: {
      target_group: targetGroupId,
    },
  });

/**
 * 处理合并请求
 * @param groupId
 * @param requestId
 * @param isApprove
 * @returns {*}
 */
export const processGroupMergeRequest = ({ groupId, requestId, isApprove }) =>
  request({
    url: `/api/party/group/${groupId}/process_merge_request/`,
    method: 'POST',
    data: {
      request_id: requestId,
      is_approve: isApprove,
    },
  });

/**
 * 群主 解散群组
 * @param id
 * @returns {*}
 */
export const dismissGroup = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/dismiss/`,
    method: 'POST',
  });

/**
 * 群主 恢复群
 * @param id
 * @returns {*}
 */
export const restoreGroup = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/restore/`,
    method: 'POST',
  });

/**
 * 群成员 拉黑群组
 * @param id
 * @returns {Promise}
 */
export const blackGroup = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/black/`,
    method: 'POST',
  });

/**
 * 取消拉黑
 * @param  {string} id 群组ID
 * @return {Promise}         [description]
 */
export const unblackGroup = (groupId) =>
  request({
    url: `/api/party/group/${groupId}/unblack/`,
    method: 'POST',
  });

// Message
// ----------

/**
 * 发送消息
 * @param toUser
 * @param toGroup
 * @param content
 * @returns {*}
 */
export const sendMessage = ({ to_user: toUser, to_group: toGroup, content }) =>
  request({
    url: '/api/party/message/',
    method: 'POST',
    data: {
      to_user: toUser,
      to_group: toGroup,
      content,
    },
  });

/**
 * 获取 Inbox History 消息
 * @param count
 * @param group
 * @param maxId
 * @param user [用户 ID]
 * @returns {*}
 */
export const getHistoryMessages = (data) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data,
  });

/**
 * 获取归档消息
 * @param count
 * @param group
 * @param since  [Message Id]
 * @param user
 * @returns {*}
 */
export const getArchiveMessages = (data) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data,
  });

/**
 * 获取消息未读数
 * @returns {*}
 */
export const getFeatUnreadCount = () =>
  request({
    url: '/api/party/message/feat_unread_count/',
  });

/**
 * 标记 Feat 消息为已读 TODO: 确定参数以及调用场景
 * @param max_id
 * @param since
 * @param count
 * @returns {*}
 */
export const featMarkAsRead = ({ maxId, since, count } = {}) =>
  request({
    url: '/api/party/message/feat_mark_read/',
    method: 'POST',
    data: {
      max_id: maxId,
      since,
      count,
    },
  });

/**
 * 拉取Feat Inbox 历史消息
 * @param maxId
 * @param since
 * @param count
 * @returns {*}
 */
export const getFeatHistory = ({ messageType, maxId, count } = {}) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data: {
      message_type: messageType,
      max_id: maxId,
      count,
      order: 'desc',
    },
  });

/**
 * 拉取 Feat Archive 归档消息
 * @param since
 * @param count
 * @returns {*}
 */
export const getFeatArchive = ({ messageType, since, count } = {}) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data: {
      message_type: messageType,
      since,
      count,
      order: 'asc',
      is_archive: true,
    },
  });

/**
 * 发送广播消息
 * @param content
 * @returns {*}
 */
export const sendBroadcastMessage = ({ content }) =>
  request({
    url: '/api/party/message/broadcast/',
    method: 'POST',
    data: {
      content,
    },
  });

/**
 * 拉取广播 Inbox 历史消息
 * @param max_id
 * @param since
 * @param count
 * @returns {*}
 */
export const getBroadcastHistory = ({ user, maxId, count, messageType } = {}) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data: {
      max_id: maxId,
      message_type: messageType,
      user,
      count,
      order: 'desc',
      is_archive: false,
    },
  });

/**
 * 获取广播 Archive 归档消息
 * @param maxId
 * @param since
 * @param count
 * @returns {*}
 */
export const getBroadcastArchive = ({ since, count, messageType } = {}) =>
  request({
    url: '/api/party/message/history/',
    method: 'POST',
    data: {
      since,
      message_type: messageType,
      count,
      order: 'asc',
      is_archive: true,
    },
  });

/**
 * 标记消息为已读
 * @param fromUser
 * @param toGroup
 * @returns {*}
 */
export const markAsRead = ({ fromUser, toGroup }) =>
  request({
    url: '/api/party/message/mark_read/',
    method: 'POST',
    data: {
      from_user: fromUser,
      to_group: toGroup,
    },
  });

/**
 * 标记群组消息为已读
 * @param id [群组ID]
 * @returns {*}
 */
export const markGroupMessagesAsRead = ({ id }) =>
  this.markAsRead({
    toGroup: [id],
  });

/**
 * 标记联系人信息为已读
 * @param id [用户ID]
 * @returns {*}
 */
export const markUserMessagesAsRead = ({ id }) =>
  this.markAsRead({
    fromUser: [id],
  });
