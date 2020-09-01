import React from 'react';
import PropTypes from 'prop-types';

import FriendRequest from './FriendRequestMessage';
import MergeRequest from './MergeRequestMessage';
import DemandMessage from './DemandMessage';

import TextMessage from '../../components/Message/TextMessage';
// import BubbleMessage from '../../components/Message/BubbleMessage';
import BroadcastMessage from '../../components/Message/Broadcast';
import SystemMessage from '../../components/Message/System';
import FriendRequestRejected from '../../components/Message/FriendRequestRejected';
import FriendRequestAccepted from '../../components/Message/FriendRequestAccepted';
import FriendRequestRecalled from '../../components/Message/FriendRequestRecalled';
import CommentMessage from '../../components/Message/Comment';
import LikeMessage from '../../components/Message/Like';
import RewordingComment from '../../components/Message/RewordingComment';
import RewordingLike from '../../components/Message/RewordingLike';
import RewordingSubmit from '../../components/Message/RewordingSubmit';
import RewordingAudit from '../../components/Message/RewordingAudit';
import ReceivingAccountMessage from '../../components/Message/ReceivingAccountMessage';
import OrderErrorMessage from '../../components/Message/OrderErrorMessage';
import CollaboratorJoin from '../../components/Message/CollaboratorJoin';
import CollaboratorChange from '../../components/Message/CollaboratorChange';

import {
  MESSAGE_TYPE_FRIEND_IM,
  MESSAGE_TYPE_FRIEND_APPLY,
  MESSAGE_TYPE_FRIEND_ACCEPT,
  MESSAGE_TYPE_FRIEND_REJECT,
  MESSAGE_TYPE_FRIEND_RECALL,
  MESSAGE_TYPE_GROUP_IM,
  MESSAGE_TYPE_GROUP_PM,
  MESSAGE_TYPE_GROUP_MERGE_REQUEST,
  MESSAGE_TYPE_BROADCAST,
  MESSAGE_TYPE_DEMAND,
  MESSAGE_TYPE_LIKED,
  MESSAGE_TYPE_COMMENT,
  MESSAGE_TYPE_DZ_REWORDING_SUBMIT,
  MESSAGE_TYPE_DZ_REWORDING_AUDIT,
  MESSAGE_TYPE_DZ_REWORDING_COMMENT,
  MESSAGE_TYPE_DZ_REWORDING_LIKE,
  MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE,
  MESSAGE_TYPE_RECEIVING_ACCOUNT_MISSING,
  MESSAGE_TYPE_ORDER_ERROR,
  MESSAGE_TYPE_DZ_COLLABORATOR_JOIN,
} from '../../constants';

import './style.scss';

const typeMap = {
  // user
  [MESSAGE_TYPE_FRIEND_IM]: TextMessage,
  [MESSAGE_TYPE_FRIEND_APPLY]: FriendRequest,
  [MESSAGE_TYPE_FRIEND_ACCEPT]: FriendRequestAccepted,
  [MESSAGE_TYPE_FRIEND_REJECT]: FriendRequestRejected,
  [MESSAGE_TYPE_FRIEND_RECALL]: FriendRequestRecalled,
  // group
  [MESSAGE_TYPE_GROUP_IM]: TextMessage,
  [MESSAGE_TYPE_GROUP_PM]: TextMessage,
  // group merge
  [MESSAGE_TYPE_GROUP_MERGE_REQUEST]: MergeRequest,
  // order message message
  [MESSAGE_TYPE_DEMAND]: DemandMessage,
  [MESSAGE_TYPE_RECEIVING_ACCOUNT_MISSING]: ReceivingAccountMessage,
  [MESSAGE_TYPE_ORDER_ERROR]: OrderErrorMessage,


  [MESSAGE_TYPE_BROADCAST]: BroadcastMessage,
  [MESSAGE_TYPE_COMMENT]: CommentMessage,
  [MESSAGE_TYPE_LIKED]: LikeMessage,
  // dimzou message
  [MESSAGE_TYPE_DZ_REWORDING_COMMENT]: RewordingComment,
  [MESSAGE_TYPE_DZ_REWORDING_LIKE]: RewordingLike,
  [MESSAGE_TYPE_DZ_REWORDING_SUBMIT]: RewordingSubmit,
  [MESSAGE_TYPE_DZ_REWORDING_AUDIT]: RewordingAudit,

  [MESSAGE_TYPE_DZ_COLLABORATOR_JOIN]: CollaboratorJoin,
  [MESSAGE_TYPE_DZ_COLLABORATOR_CHANGE]: CollaboratorChange,
  
};

const MessageContainer = (props) => {
  const Render = typeMap[props.message.message_type] || SystemMessage;
  return <Render {...props} />;
};

MessageContainer.propTypes = {
  message: PropTypes.object,
};

export default MessageContainer;
