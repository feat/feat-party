import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatTimezone } from '@/utils/time';
import { formatMessage } from '@/services/intl';

import Avatar from '@feat/feat-ui/lib/avatar';
import Modal from '@feat/feat-ui/lib/modal';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import LiveClock from '@/components/LiveClock';

import mMessage from '../../messages';
import Contact from '../Contact';

// import { defaultAvatar } from '../../../../config/constants/defaultImages';

import './style.scss';
import { CONTACT_LIST_STATUS_BLACK } from '../../constants';

const defaultAvatar = '';
const AVATAR_SIZE = 32;
const avatarStyle = {
  width: `${AVATAR_SIZE / 16}rem`,
  height: `${AVATAR_SIZE / 16}rem`,
  borderRadius: '50%',
};

class GroupMemberContact extends Component {
  tryToRemoveUser = (e) => {
    e.stopPropagation();
    const { onRemove, contact } = this.props;
    Modal.confirm({
      title: formatMessage(mMessage.removeUserTitle),
      content: formatMessage(mMessage.removeUserContent),
      onCancel: () => {},
      onConfirm: () => {
        onRemove({ userId: contact.user });
      },
    });
  };

  tryToRestoreUser = (e) => {
    e.stopPropagation();
    const { onRestore, contact } = this.props;
    onRestore({ userId: contact.user });
  }

  handleClick = (e) => {
    const { contact, onClick } = this.props;
    e.stopPropagation();
    onClick(contact);
  };

  getHandleClick() {
    const { onClick, contact, isSelf } = this.props;
    if (!onClick) {
      return undefined;
    }
    if (contact.is_removed) {
      return undefined;
    }
    if (isSelf) {
      return undefined;
    }
    if (contact.status === CONTACT_LIST_STATUS_BLACK) {
      return undefined;
    }
    return this.handleClick;
  }

  handleNameClicked = (e) => {
    const { active, contact, onNameClick } = this.props;
    if (active && onNameClick) {
      e.stopPropagation();
      onNameClick(contact);
    }
  };

  render() {
    const {
      contact,
      active,
      canRemove,
      isSelf,
      onRemove,
      onRestore,
      onClick,
      onNameClick,
      ...htmlProps
    } = this.props;
    const { avatar, expertise } = contact;
    const name = contact.fullname || String(contact.user);
    const handleClick = this.getHandleClick();
    return (
      <Contact.Wrap modifier="groupMember">
        <Contact
          {...htmlProps}
          modifier="groupMember"
          isActive={active}
          onClick={handleClick}
          isRemoved={
            contact.is_removed || contact.status === CONTACT_LIST_STATUS_BLACK
          }
          isSelf={isSelf}
        >
          <Contact.Container>
            <Contact.TitleContainer>
              <Contact.Avatar>
                <Avatar
                  style={avatarStyle}
                  avatar={avatar || defaultAvatar}
                  username={name}
                  round
                />
              </Contact.Avatar>
              <Contact.Info>
                <Contact.Name
                  onClick={this.handleNameClicked}
                  className={active ? 'has-action' : undefined}
                >
                  {name}
                  {contact.status === CONTACT_LIST_STATUS_BLACK && (
                    <span className="IM-Contact__label">
                      {formatMessage(mMessage.contactHasLeft)}
                    </span>
                  )}
                </Contact.Name>
                <Contact.Meta>{expertise}</Contact.Meta>
              </Contact.Info>
            </Contact.TitleContainer>
            <Contact.RightTitleContainer>
              <Contact.Meta modifier="location">
                {contact.location}
              </Contact.Meta>
              <Contact.Meta modifier="localTime">
                {contact.timezone_utc_offset && (
                  <LiveClock
                    timezone={formatTimezone(contact.timezone_utc_offset)}
                    ticking
                  />
                )}
              </Contact.Meta>
            </Contact.RightTitleContainer>
          </Contact.Container>
          {canRemove &&
            !contact.is_removed && (
            <IconButton
              className="IM-Contact__removeBtn"
              svgIcon="cross"
              onClick={this.tryToRemoveUser}
            />
          )}
          {canRemove && contact.is_removed && (
            <IconButton
              className="IM-Contact__restoreBtn"
              svgIcon="restore"
              onClick={this.tryToRestoreUser}
            />
          )}
        </Contact>
      </Contact.Wrap>
    );
  }
}

GroupMemberContact.propTypes = {
  active: PropTypes.bool,
  contact: PropTypes.object,
  canRemove: PropTypes.bool,
  isSelf: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  onNameClick: PropTypes.func,
};

export default GroupMemberContact;
