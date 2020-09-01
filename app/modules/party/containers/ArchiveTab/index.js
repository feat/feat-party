import React from 'react';
import PropTypes from 'prop-types';

import {
  DRAGGABLE_TYPE_USER_CONTACT as USER_CONTACT,
  DRAGGABLE_TYPE_GROUP_CONTACT as GROUP_CONTACT,
} from '@/services/dnd';

import { formatMessage } from '@/services/intl';

import Modal from '@feat/feat-ui/lib/modal';

import {
  IM_TAB_ARCHIVE,
  CONTACT_LIST_STATUS_BLACK,
  GROUP_STATUS_DISMISS,
} from '../../constants';
import { changeTab, blackUser, blackGroup, dismissGroup } from '../../actions';

import IMTab from '../../components/IMTab';
import { alert as alertMessages } from '../../messages';

import { getRoomId } from '../../utils/room';

class ArchiveTab extends React.Component {
  canDrop = (item) => {
    const {
      type,
      payload: { contact },
    } = item;

    if (contact.status === CONTACT_LIST_STATUS_BLACK) {
      return false;
    }
    if (type === GROUP_CONTACT) {
      if (contact.group.status === GROUP_STATUS_DISMISS) {
        return false;
      }
    }
    return true;
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(changeTab(IM_TAB_ARCHIVE));
  };

  handleDrop = (item) => {
    const { currentUserId } = this.props;

    const {
      type,
      payload: { contact },
    } = item;

    switch (type) {
      case USER_CONTACT:
        this.confirmToBlackUser(contact);
        break;
      case GROUP_CONTACT:
        if (contact.group.creator === currentUserId) {
          this.confirmToDismissGroup(contact);
        } else {
          this.confirmToBlackGroup(contact);
        }
        break;
      default:
        logging.warning('Unknown Contact Type', type);
    }
  };

  confirmToBlackUser = (contact) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.blackUserConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          blackUser({
            userId: contact.friend,
            contactId: contact.id,
            roomId: getRoomId(contact),
          }),
        );
      },
    });
  };

  confirmToDismissGroup = (contact) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.dismissGroupConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          dismissGroup({
            groupId: contact.group.id,
            contactId: contact.id,
            roomId: getRoomId(contact),
          }),
        );
      },
    });
  };

  confirmToBlackGroup = (contact) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: formatMessage(alertMessages.confirmLabel),
      content: formatMessage(alertMessages.blackGroupConfirm),
      onCancel: () => {},
      onConfirm: () => {
        dispatch(
          blackGroup({
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
        modifier="archive"
        active={active}
        label={label}
        canDrop={this.canDrop}
        onClick={this.handleClick}
        handleDrop={this.handleDrop}
      />
    );
  }
}

ArchiveTab.propTypes = {
  currentUserId: PropTypes.number,
  active: PropTypes.bool,
  label: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
};

export default ArchiveTab;
