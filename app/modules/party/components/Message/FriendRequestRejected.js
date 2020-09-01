import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';
import {
  friendRequest as friendRequestMessages,
  token as tokenMessages,
} from '../../messages';

class FriendRequestRejected extends React.PureComponent {
  render() {
    const { message, isFromCurrentUser, isToCurrentUser } = this.props;
    return (
      <TMessage modifier="static">
        <TMessage.Header>
          <TMessage.Meta>{formatMessageTime(message.send_time)}</TMessage.Meta>
        </TMessage.Header>
        <TMessage.Content>
          <FormattedMessage
            {...friendRequestMessages.rejected}
            values={{
              subject: (
                <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
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
        </TMessage.Content>
      </TMessage>
    );
  }
}

FriendRequestRejected.propTypes = {
  message: PropTypes.object,
  isFromCurrentUser: PropTypes.bool,
  isToCurrentUser: PropTypes.bool,
};

export default FriendRequestRejected;
