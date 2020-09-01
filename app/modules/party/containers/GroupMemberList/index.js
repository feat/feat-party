import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';
import { getAppLink } from '@/utils/user';

import {
  setRoomTargetUser,
  addGroupMembers,
  removeGroupMember,
  getGroupMembers,
} from '../../actions';

import MemberList from '../../components/GroupMemberList';
import Loading from '../../components/Loading';

class MemberListContainer extends Component {
  componentDidMount() {
    this.props.dispatch(
      getGroupMembers({
        roomId: this.props.roomId,
        groupId: this.props.contact.group.id,
      }),
    );
  }

  componentDidUpdate() {
    const { roomInfo } = this.props;
    if (roomInfo.shouldRefreshMember && !roomInfo.fetchingMembers) {
      this.props.dispatch(
        getGroupMembers({
          roomId: this.props.roomId,
          groupId: this.props.contact.group.id,
        }),
      );
    }
  }

  handleRemoveUser = (data) => {
    const { dispatch } = this.props;
    dispatch(
      removeGroupMember({
        contactId: this.props.contact.id,
        roomId: this.props.roomId,
        groupId: this.props.contact.group.id,
        userId: data.userId,
      }),
    );
  };

  handleRestoreUser = (data) => {
    const { dispatch, contact } = this.props;
    dispatch(
      addGroupMembers({
        roomId: this.props.roomInfo,
        groupId: contact.group.id,
        contactId: contact.id,
        members: [data.userId],
        type: 'restore',
      }),
    );
  };

  toggleTargetUser = (contact) => {
    const {
      roomInfo: { targetUser },
      roomId,
      currentUser,
      dispatch,
    } = this.props;
    const { user: userId } = contact;
    if (currentUser.uid === contact.user) {
      return;
    }
    dispatch(
      setRoomTargetUser({
        roomId,
        member: targetUser && targetUser.uid === userId ? undefined : contact,
      }),
    );
  };

  viewUserProfile = (contact) => {
    const { user: userId } = contact;
    Router.push(
      {
        pathname: '/user-profile', // TODO: link for current user
        query: { userId },
      },
      getAppLink(userId),
    ).then(() => {
      window.scrollTo(0, 0);
    });
  };

  render() {
    const {
      contact: {
        group: { members, creator },
      },
      roomInfo: { targetUser, fetchingMembers, memberFetched },
      currentUser,
    } = this.props;

    const isOwner = creator === currentUser.uid;
    if (fetchingMembers || !memberFetched) {
      return <Loading size="xs" modifier="groupMemberList" />;
    }
    return (
      <MemberList
        members={members}
        targetUser={targetUser}
        isOwner={isOwner}
        currentUser={currentUser}
        onMemberClick={this.toggleTargetUser}
        onRemoveMember={this.handleRemoveUser}
        onRestoreMember={this.handleRestoreUser}
        onMemberNameClick={this.viewUserProfile}
      />
    );
  }
}

MemberListContainer.propTypes = {
  roomId: PropTypes.string,
  currentUser: PropTypes.object,
  dispatch: PropTypes.func,
  contact: PropTypes.shape({
    id: PropTypes.number,
    group: PropTypes.object,
  }),
  roomInfo: PropTypes.shape({
    fetchingMembers: PropTypes.bool,
    shouldRefreshMember: PropTypes.bool,
    targetUser: PropTypes.object,
  }),
};

export default MemberListContainer;
