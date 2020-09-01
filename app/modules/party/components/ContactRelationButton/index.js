import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatMessage } from '@/services/intl';

import Popover from '@feat/feat-ui/lib/popover';
import IconButton from '@feat/feat-ui/lib/button/IconButton';

import intlMessages from './messages';

import {
  CONTACT_LIST_STATUS_STRANGER,
  CONTACT_LIST_STATUS_APPLYING,
  CONTACT_LIST_STATUS_RECALLED,
  CONTACT_LIST_STATUS_REJECTED,
  CONTACT_LIST_STATUS_CREATING,
  CONTACT_LIST_STATUS_CREATED,
  CONTACT_LIST_STATUS_BLACK,
} from '../../constants';

import './style.scss';

const stopPropagation = (e) => {
  e.stopPropagation();
};

class ContactRelationButton extends React.PureComponent {
  getPopoverContent() {
    const { status, userId } = this.props;

    switch (status) {
      case CONTACT_LIST_STATUS_STRANGER:
      case CONTACT_LIST_STATUS_RECALLED:
        return (
          <div
            role="button"
            tabIndex="-1"
            onClick={stopPropagation}
            className="IM-ContactRelationMessage"
          >
            <div className="IM-ContactRelationMessage__content">
              <h3 className="IM-ContactRelationMessage__title">
                {formatMessage(intlMessages.buildRelationshipTitle)}
              </h3>
              <p className="IM-ContactRelationMessage__desc">
                {formatMessage(intlMessages.buildRelationshipDesc)}
              </p>
            </div>
            <div className="IM-ContactRelationMessage__footer">
              <IconButton
                svgIcon="no-btn"
                aria-label="cancel"
                className="margin_r_12"
                onClick={this.closePopover}
              />
              <IconButton
                svgIcon="ok-btn"
                aria-label="confirm"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.postFriendRequest({ userId });
                  this.closePopover();
                }}
              />
            </div>
          </div>
        );
      case CONTACT_LIST_STATUS_REJECTED:
        return (
          <div
            role="button"
            tabIndex="-1"
            onClick={stopPropagation}
            className="IM-ContactRelationMessage"
          >
            <div className="IM-ContactRelationMessage__content">
              <h3 className="IM-ContactRelationMessage__title">
                {formatMessage(intlMessages.buildRelationshipTitle)}
              </h3>
              <p className="IM-ContactRelationMessage__desc">
                {formatMessage(intlMessages.buildRelationshipAgain)}
              </p>
            </div>
            <div className="IM-ContactRelationMessage__footer">
              <IconButton
                svgIcon="no-btn"
                aria-label="cancel"
                className="margin_r_12"
                onClick={this.closePopover}
              />
              <IconButton
                svgIcon="ok-btn"
                aria-label="confirm"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.postFriendRequest({ userId });
                  this.closePopover();
                }}
              />
            </div>
          </div>
        );
      case CONTACT_LIST_STATUS_CREATING:
        return (
          <div
            role="button"
            tabIndex="-1"
            onClick={stopPropagation}
            className="IM-ContactRelationMessage"
          >
            <div className="IM-ContactRelationMessage__content">
              <h3 className="IM-ContactRelationMessage__title">
                {formatMessage(intlMessages.recallFriendRequestTitle)}
              </h3>
              <p className="IM-ContactRelationMessage__desc">
                {formatMessage(intlMessages.recallFriendRequestDesc)}
              </p>
            </div>
            <div className="IM-ContactRelationMessage__footer">
              <IconButton
                svgIcon="no-btn"
                aria-label="cancel"
                className="margin_r_12"
                onClick={this.closePopover}
              />
              <IconButton
                svgIcon="ok-btn"
                aria-label="confirm"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.recallFriendRequest({ userId });
                  this.closePopover();
                }}
              />
            </div>
          </div>
        );
      case CONTACT_LIST_STATUS_APPLYING:
        return (
          <div
            role="button"
            tabIndex="-1"
            onClick={stopPropagation}
            className="IM-ContactRelationMessage"
          >
            <div className="IM-ContactRelationMessage__content">
              <h3 className="IM-ContactRelationMessage__title">
                {formatMessage(intlMessages.confirmFriendRequestTitle)}
              </h3>
              <p className="IM-ContactRelationMessage__desc">
                {formatMessage(intlMessages.confirmFriendRequestDesc)}
              </p>
            </div>
            <div className="IM-ContactRelationMessage__footer">
              <IconButton
                svgIcon="no-btn"
                aria-label="reject"
                className="margin_r_12"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.rejectFriendRequest({ userId });
                  this.closePopover();
                }}
              />
              <IconButton
                svgIcon="ok-btn"
                aria-label="accept"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.acceptFriendRequest({ userId });
                  this.closePopover();
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  closePopover = () => {
    if (this.popover) {
      this.popover.closePortal();
    }
  };

  render() {
    const { status } = this.props;

    if (
      status === CONTACT_LIST_STATUS_CREATED ||
      status === CONTACT_LIST_STATUS_BLACK
    ) {
      return null;
    }

    const content = this.getPopoverContent();
    return (
      <div className="IM-ContactButtonWrap">
        <Popover
          ref={(n) => {
            this.popover = n;
          }}
          onOpen={() => {
            global.FEAT_PARTY.relationBtnOpened = true;
          }}
          onClose={() => {
            global.FEAT_PARTY.relationBtnOpened = false;
          }}
          placement="right"
          content={content}
          trigger="click"
        >
          <button
            type="button"
            aria-label="relation-button"
            className={classNames('IM-ContactStatus', {
              'IM-ContactStatus_info':
                status === CONTACT_LIST_STATUS_STRANGER ||
                status === CONTACT_LIST_STATUS_RECALLED,
              'IM-ContactStatus_pending':
                status === CONTACT_LIST_STATUS_APPLYING ||
                status === CONTACT_LIST_STATUS_CREATING,
              'IM-ContactStatus_rejected':
                status === CONTACT_LIST_STATUS_REJECTED,
            })}
          />
        </Popover>
      </div>
    );
  }
}

ContactRelationButton.propTypes = {
  status: PropTypes.number,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  postFriendRequest: PropTypes.func,
  acceptFriendRequest: PropTypes.func,
  rejectFriendRequest: PropTypes.func,
  recallFriendRequest: PropTypes.func,
};

export default ContactRelationButton;
