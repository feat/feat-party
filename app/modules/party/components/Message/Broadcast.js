import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { formatMessage } from '@/services/intl';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';
import {
  messages as partyMessages,
  token as tokenMessages,
} from '../../messages';

const BroadcastMessage = (props) => {
  const { message, isFromCurrentUser } = props;
  const { content, send_time } = message;
  return (
    <TMessage modifier={isFromCurrentUser ? 'outbound' : 'inbound'}>
      <TMessage.Container>
        <TMessage.Header>
          <FormattedMessage
            {...partyMessages.broadcast}
            values={{
              subject: (
                <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
                  {isFromCurrentUser
                    ? formatMessage(tokenMessages.firstPersonSubject)
                    : message.from_name || message.from_user}
                </TMessage.User>
              ),
            }}
          />
          <TMessage.Meta>
            {/* &lt; */}
            <TMessage.Time>{formatMessageTime(send_time)}</TMessage.Time>
            {/* &gt; */}
          </TMessage.Meta>
        </TMessage.Header>
      </TMessage.Container>
      <TMessage.Content>{content}</TMessage.Content>
    </TMessage>
  );
};

BroadcastMessage.propTypes = {
  message: PropTypes.object,
  isFromCurrentUser: PropTypes.bool,
};

export default BroadcastMessage;
