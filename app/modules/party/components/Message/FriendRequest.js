import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import TMessage from '../IMMessage';

import {
  friendRequest as friendRequestMessages,
  friendRequestStatus as friendRequestStatusMessages,
  token as tokenMessages,
} from '../../messages';
import formatMessageTime from '../../utils/formatMessageTime';

class FriendRequestMessage extends React.Component {
  handleReject = () => {
    const { message } = this.props;
    this.props.onReject({
      userId: message.from_user,
      message,
    });
  };

  handleAccept = () => {
    const { message } = this.props;
    this.props.onAccept({
      userId: message.from_user,
      message,
    });
  };

  renderFooter(isExpired) {
    const { message } = this.props;

    const shouldDisplayAction =
      !isExpired && (!message.detail || !message.detail.is_handled);

    const hasHandledResult = message.detail && message.detail.is_handled;

    if (!message.detail) {
      return null;
    }

    if (!shouldDisplayAction && !hasHandledResult) {
      return null;
    }
    return (
      <TMessage.Footer>
        {shouldDisplayAction && (
          <IconButton
            className="margin_r_12"
            svgIcon="no-btn"
            size="sm"
            onClick={this.handleReject}
          />
        )}
        {shouldDisplayAction && (
          <IconButton svgIcon="ok-btn" size="sm" onClick={this.handleAccept} />
        )}
        {hasHandledResult && (
          <TMessage.Info>
            {message.detail.action === 'accept' &&
              formatMessage(friendRequestStatusMessages.accepted)}
            {message.detail.action === 'reject' &&
              formatMessage(friendRequestStatusMessages.rejected)}
            {message.detail.action === 'recall' &&
              formatMessage(friendRequestStatusMessages.recalled)}
          </TMessage.Info>
        )}
      </TMessage.Footer>
    );
  }

  render() {
    const { message, isFromCurrentUser, isToCurrentUser } = this.props;
    const { send_time: sendTime } = message;
    const VALID_RANGE = 1000 * 60 * 60 * 24; // 24 hour
    const isExpired = Date.now() - new Date(sendTime) > VALID_RANGE;
    return (
      <TMessage hasAction modifier="friend">
        <TMessage.Header>
          <TMessage.Meta>
            <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
          </TMessage.Meta>
        </TMessage.Header>
        <TMessage.Content modifier="friend">
          <TMessage.Text>
            <FormattedMessage
              {...friendRequestMessages.posted}
              values={{
                subject: (
                  <TMessage.User
                    modifier={isFromCurrentUser ? 'self' : 'other'}
                  >
                    {isFromCurrentUser
                      ? formatMessage(tokenMessages.firstPersonSubject)
                      : message.from_name || message.from_user}
                  </TMessage.User>
                ),
                object: (
                  <TMessage.User modifier={isToCurrentUser ? 'self' : 'other'}>
                    {isToCurrentUser
                      ? formatMessage(tokenMessages.firstPersonObject)
                      : message.to_name || message.to_user}
                  </TMessage.User>
                ),
              }}
            />
          </TMessage.Text>
        </TMessage.Content>
        {isToCurrentUser && this.renderFooter(isExpired)}
      </TMessage>
    );
  }
}

FriendRequestMessage.propTypes = {
  isFromCurrentUser: PropTypes.bool,
  isToCurrentUser: PropTypes.bool,
  message: PropTypes.object,
  onReject: PropTypes.func,
  onAccept: PropTypes.func,
};

export default FriendRequestMessage;
