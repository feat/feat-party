import React from 'react';
import PropTypes from 'prop-types';

import {
  DRAGGABLE_TYPE_USER_CONTACT as USER_CONTACT,
  DRAGGABLE_TYPE_GROUP_CONTACT as GROUP_CONTACT,
} from '@/services/dnd';

import { formatMessage } from '@/services/intl';

import Modal from '@feat/feat-ui/lib/modal';

import {
  changeTab,
  unblackUser,
  unblackGroup,
  restoreGroup,
} from '../../actions';

import IMTab from '../../components/IMTab';

import {
  IM_TAB_INBOX,
  CONTACT_LIST_STATUS_BLACK,
  GROUP_STATUS_DISMISS,
} from '../../constants';
import { getRoomId } from '../../utils/room';
import { alert as alertMessages } from '../../messages';

class InboxTab extends React.Component {
  canDrop = (item) => {
    const {
      type,
      payload: { contact },
    } = item;

    if (type === USER_CONTACT) {
      return contact.status === CONTACT_LIST_STATUS_BLACK;
    }
    if (type === GROUP_CONTACT) {
      if (
        contact.group.creator === this.props.currentUserId &&
        contact.group.status === GROUP_STATUS_DISMISS
      ) {
        return true;
      }
      if (
        contact.group.creator !== this.props.currentUserId &&
        contact.status === CONTACT_LIST_STATUS_BLACK
      ) {
        return true;
      }
    }
    return false;
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { currentContact, currentUserId } = this.props;
    if (
      currentContact &&
      currentContact.group &&
      currentContact.group.status === GROUP_STATUS_DISMISS
    ) {
      const message =
        currentContact.group.creator === currentUserId
          ? formatMessage(alertMessages.groupRestoreHintForCreator)
          : formatMessage(alertMessages.groupRestoreHint);
      Modal.error({
        title: formatMessage(alertMessages.notAllowedLabel),
        content: message,
      });
    } else if (
      currentContact &&
      currentContact.group &&
      currentContact.group.status !== GROUP_STATUS_DISMISS &&
      currentContact.status === CONTACT_LIST_STATUS_BLACK
    ) {
      Modal.confirm({
        title: formatMessage(alertMessages.confirmLabel),
        content: formatMessage(alertMessages.unblackGroupNotice),
        onConfirm: () => {
          this.props.dispatch(
            unblackGroup({
              groupId: currentContact.group.id,
              nextAction: changeTab(IM_TAB_INBOX),
            }),
          );
        },
        onCancel: () => {},
      });
    } else if (
      currentContact &&
      currentContact.friend &&
      currentContact.status === CONTACT_LIST_STATUS_BLACK
    ) {
      Modal.info({
        title: formatMessage(alertMessages.infoLabel),
        content: formatMessage(alertMessages.unblackUserNotice),
      });
    } else {
      this.props.dispatch(changeTab(IM_TAB_INBOX));
    }
  };

  handleDrop = (item) => {
    const { currentUserId } = this.props;
    const {
      type,
      payload: { contact },
    } = item;

    switch (type) {
      case USER_CONTACT:
        this.confirmToUnblackUser(contact);
        break;
      case GROUP_CONTACT:
        if (contact.group.creator === currentUserId) {
          this.confirmToRestoreGroup(contact);
        } else {
          this.confirmToUnblackGroup(contact);
        }
        break;
      default:
        logging.warn('Unkown Contact Type', type);
    }
  };

  confirmToUnblackUser = (contact) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.unblackUserConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          unblackUser({
            userId: contact.friend,
            contactId: contact.id,
            roomId: getRoomId(contact),
          }),
        );
      },
    });
  };

  confirmToRestoreGroup = (contact) => {
    const { dispatch } = this.props;
    if (!contact.group.is_valid) {
      Modal.info({
        title: formatMessage(alertMessages.infoLabel),
        content: formatMessage(alertMessages.groupCantRestore),
      });
      return;
    }
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.restoreGroupConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          restoreGroup({
            groupId: contact.group.id,
            contactId: contact.id,
            roomId: getRoomId(contact),
          }),
        );
      },
    });
  };

  confirmToUnblackGroup = (contact) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.unblackGroupConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          unblackGroup({
            groupId: contact.group.id,
            contactId: contact.id,
            roomId: getRoomId(contact),
          }),
        );
      },
    });
  };

  render() {
    const { active, label } = this.props;
    return (
      <IMTab
        modifier="inbox"
        active={active}
        label={label}
        canDrop={this.canDrop}
        onClick={this.handleClick}
        handleDrop={this.handleDrop}
      />
    );
  }
}

InboxTab.propTypes = {
  currentUserId: PropTypes.number,
  active: PropTypes.bool,
  label: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  currentContact: PropTypes.object,
};

export default InboxTab;
