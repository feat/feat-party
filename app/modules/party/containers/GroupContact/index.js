import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DropTarget, DragSource } from 'react-dnd';

import { formatMessage } from '@/services/intl';
import {
  DRAGGABLE_TYPE_GROUP_CONTACT as GROUP_CONTACT,
  DRAGGABLE_TYPE_USER_CONTACT as USER_CONTACT,
} from '@/services/dnd';
import {
  addEventListenerFor,
  removeEventListenerFor,
} from '@/services/dnd/helpers';

import Avatar from '@feat/feat-ui/lib/avatar';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Modal from '@feat/feat-ui/lib/modal';

import { selectCurrentUser } from '@/modules/auth/selectors';

import defaultGroupAvatar from '../../images/groupAvatar.png';

import GroupMemberList from '../GroupMemberList';
import Contact from '../../components/Contact';

import {
  getContactName,
  getContactMeta,
  getContactAvatar,
} from '../../utils/contact';

import { selectRoomInfo } from '../../selectors';
import {
  changeRoom,
  initRenameGroup,
  // fetchGroupAvatar,
  cancelRenameGroup,
  renameGroup,
  addGroupMembers,
  postGroupMerge,
} from '../../actions';

import {
  GLOBAL_ROOM,
  GROUP_STATUS_REQUESTING_MERGE,
  GROUP_STATUS_CHECKING_MERGE,
  GROUP_STATUS_DISMISS,
  GROUP_STATUS_DELETED,
  CONTACT_LIST_STATUS_BLACK,
} from '../../constants';
import {
  alert as alertMessages,
  groupStatusHint as groupStatusHintMessages,
} from '../../messages';
import './style.scss';

const groupContactSource = {
  canDrag(props) {
    if (!props.info) {
      return true;
    }
    return !props.info.isRenameActive;
  },
  beginDrag(props, monitor, component) {
    const dom = ReactDOM.findDOMNode(component);
    if (dom.parentElement) {
      addEventListenerFor(dom.parentElement);
    }
    return {
      type: GROUP_CONTACT,
      payload: {
        contact: props.contact,
      },
    };
  },
  endDrag(props, monitor, component) {
    const dom = ReactDOM.findDOMNode(component);
    if (dom.parentElement) {
      removeEventListenerFor(dom.parentElement);
    }
  },
};

const sourceCollect = (collect, monitor) => ({
  connectDragSource: collect.dragSource(),
  isDragging: monitor.isDragging(),
});

const contactTarget = {
  canDrop(props, monitor) {
    if (props.archiveMode) {
      return false;
    }
    const item = monitor.getItem();
    const targetGroup = props.contact.group;
    if (targetGroup.status === GROUP_STATUS_DISMISS) {
      return false;
    }
    if (item.type === GROUP_CONTACT) {
      const sourceGroup = item.payload.contact.group;
      if (targetGroup.id === sourceGroup.id) {
        return false;
      }

      // sourceGroup should be currentUser's group to perform merge request.
      if (sourceGroup.creator !== props.currentUser.uid) {
        return false;
      }

      if (
        sourceGroup.status === GROUP_STATUS_REQUESTING_MERGE ||
        sourceGroup.status === GROUP_STATUS_CHECKING_MERGE ||
        sourceGroup.status === GROUP_STATUS_DISMISS ||
        sourceGroup.status === GROUP_STATUS_DELETED
      ) {
        return false;
      }

      if (
        targetGroup.status === GROUP_STATUS_REQUESTING_MERGE ||
        sourceGroup.status === GROUP_STATUS_CHECKING_MERGE ||
        targetGroup.status === GROUP_STATUS_DELETED
      ) {
        return false;
      }
    }
    if (item.type === USER_CONTACT) {
      const userId = item.payload.contact.friend;
      if (userId === targetGroup.creator) {
        return false;
      }
    }
    return item.type === USER_CONTACT || item.type === GROUP_CONTACT;
  },
  drop(props, monitor) {
    const item = monitor.getItem();
    const { dispatch, contact, roomId } = props;
    if (item.type === USER_CONTACT) {
      // add Group Member
      // TODO: permission control
      const userId = item.payload.contact.friend;
      if (
        contact.group.members &&
        contact.group.members.some((member) => member.user === userId)
      ) {
        Modal.info({
          title: formatMessage(alertMessages.noticeLabel),
          content: formatMessage(alertMessages.userHasJoinedGroup, {
            username: item.payload.contact.friend_fullname || userId,
          }),
        });
        return;
      }
      dispatch(
        addGroupMembers({
          roomId,
          groupId: contact.group.id,
          contactId: contact.id,
          members: [userId],
        }),
      );
    } else {
      // merge Group Request
      Modal.confirm({
        title: formatMessage(alertMessages.confirmLabel),
        content: formatMessage(alertMessages.mergeGroupConfirm, {
          sourceGroup: getContactName(item.payload.contact),
          targetGroup: getContactName(contact),
        }),
        onCancel: () => {},
        onConfirm: () => {
          dispatch(
            postGroupMerge({
              sourceGroupId: item.payload.contact.group.id,
              targetGroupId: contact.group.id,
              sourceContactId: item.payload.contact.id,
              targetContactId: contact.id,
              roomId,
              userIsOwnerOfBoth:
                item.payload.contact.group.creator === contact.group.creator,
            }),
          );
        },
      });
    }
  },
};

const dropCollect = (collect, monitor) => ({
  connectDropTarget: collect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
});

class GroupContact extends Component {
  // componentDidMount() {
  //   const { contact: { group } }  = this.props;
  //   if (!group.avatar) {
  //     this.props.dispatch(fetchGroupAvatar(group));
  //   }
  // }

  toggleContact = (e) => {
    e.preventDefault();
    const { active, roomId, dispatch, contact } = this.props;
    dispatch(
      changeRoom(
        active
          ? {
            roomId: GLOBAL_ROOM,
          }
          : {
            roomId,
            contact,
          },
      ),
    );
  };

  handleNameClick = (e) => {
    const { currentUser, contact, dispatch, roomId, active } = this.props;
    if (contact.group.creator !== currentUser.uid) {
      return;
    }
    // Bundle related group cannot rename
    if (contact.group.bundle_id) {
      return;
    }
    if (
      contact.group.status === GROUP_STATUS_DISMISS ||
      contact.group.status === GROUP_STATUS_REQUESTING_MERGE ||
      !active
    ) {
      return;
    }
    e.stopPropagation();
    this.originName = contact.group.name;
    dispatch(
      initRenameGroup({
        roomId,
        name: contact.group.name,
      }),
    );
  };

  handelBlur = () => {
    const { roomId, dispatch } = this.props;
    const input = document.getElementById(`${roomId}_renameInput`);
    if (input.value.trim() === this.originName) {
      dispatch(
        cancelRenameGroup({
          roomId,
        }),
      );
    }
  };

  handleConfirmRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { roomId, contact } = this.props;
    const input = document.getElementById(`${roomId}_renameInput`);
    const { value } = input;
    if (!value.trim()) {
      return;
    }
    if (value.length > 128) {
      Modal.error({
        title: formatMessage(alertMessages.invalidGroupName),
        content: formatMessage(alertMessages.maxLengthOfGroupName, {
          maxLength: 128,
        }),
      });
      return;
    }
    this.props.dispatch(
      renameGroup({
        roomId,
        groupId: contact.group.id,
        name: value,
      }),
    );
  };

  handleCancelRename = (e) => {
    e.stopPropagation();
    const { dispatch, roomId } = this.props;
    dispatch(
      cancelRenameGroup({
        roomId,
      }),
    );
  };

  renderRenameForm() {
    const { info, roomId } = this.props;
    return (
      <form className="IM-GroupContactRenameForm">
        <input
          id={`${roomId}_renameInput`}
          type="text"
          defaultValue={info.name}
          className="IM-GroupContactRenameForm__input"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(e) => {
            if (e.target.value.length > 128) {
              e.target.classList.add('is-invalid');
            } else {
              e.target.classList.remove('is-invalid');
            }
          }}
          onBlur={this.handelBlur}
          autoFocus
        />
        <IconButton
          className="IM-GroupContactRenameForm__cancel"
          size="xs"
          svgIcon="no-btn"
          disabled={info.isRenaming}
          onClick={this.handleCancelRename}
        />
        <IconButton
          className="IM-GroupContactRenameForm__confirm"
          size="xs"
          svgIcon="ok-btn"
          htmlType="submit"
          disabled={info.isRenaming}
          onClick={this.handleConfirmRename}
        />
      </form>
    );
  }

  render() {
    const {
      connectDropTarget,
      connectDragSource,
      contact,
      active,
      isOver,
      canDrop,
      currentUser,
      info = {},
      archiveMode,
      roomId,
    } = this.props;
    const isOwner = contact.group.creator === currentUser.uid;

    const name = getContactName(contact);
    const meta = getContactMeta(contact);
    const avatar = getContactAvatar(contact);
    return (
      <Contact.Wrap
        isActive={active}
        modifier="group"
        ref={(n) => {
          // eslint-disable-next-line
          connectDropTarget((this.wrapperDom = ReactDOM.findDOMNode(n)));
        }}
      >
        <Contact
          modifier="group"
          isActive={active}
          isOver={isOver && canDrop}
          onClick={this.toggleContact}
          ref={(n) => {
            // eslint-disable-next-line
            connectDragSource((this.contactDom = ReactDOM.findDOMNode(n)));
          }}
        >
          <Contact.Container>
            <Contact.TitleContainer>
              <Contact.Avatar count={archiveMode ? 0 : contact.unread_count}>
                <Avatar
                  avatar={avatar || defaultGroupAvatar}
                  username={name}
                  archived={
                    contact.group.status === GROUP_STATUS_DISMISS ||
                    contact.status === CONTACT_LIST_STATUS_BLACK
                  }
                />
              </Contact.Avatar>
              <Contact.Info>
                {info.isRenameActive ? (
                  this.renderRenameForm()
                ) : (
                  <Contact.Name onClick={this.handleNameClick}>
                    {name}
                  </Contact.Name>
                )}
                <Contact.Meta>
                  {meta}
                  {contact.group.creator === currentUser.uid &&
                    contact.group.status === GROUP_STATUS_REQUESTING_MERGE &&
                    formatMessage(groupStatusHintMessages.requestingMerge)}
                  {contact.group.creator === currentUser.uid &&
                    contact.group.status === GROUP_STATUS_CHECKING_MERGE &&
                    formatMessage(groupStatusHintMessages.checkingMerge)}
                </Contact.Meta>
              </Contact.Info>
            </Contact.TitleContainer>
          </Contact.Container>
        </Contact>
        {active && (
          <GroupMemberList
            currentUser={currentUser}
            contact={contact}
            isOwner={isOwner}
            roomId={roomId}
            roomInfo={this.props.info}
            dispatch={this.props.dispatch}
          />
        )}
      </Contact.Wrap>
    );
  }
}

GroupContact.propTypes = {
  dispatch: PropTypes.func.isRequired,
  roomId: PropTypes.string,
  active: PropTypes.bool,
  contact: PropTypes.object,
  currentUser: PropTypes.object,
  info: PropTypes.object,
  archiveMode: PropTypes.bool,
  connectDropTarget: PropTypes.func,
  connectDragSource: PropTypes.func,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  info: selectRoomInfo,
});

const DnDGroupContact = DropTarget(
  [USER_CONTACT, GROUP_CONTACT],
  contactTarget,
  dropCollect,
)(DragSource(GROUP_CONTACT, groupContactSource, sourceCollect)(GroupContact));

export default connect(mapStateToProps)(DnDGroupContact);
