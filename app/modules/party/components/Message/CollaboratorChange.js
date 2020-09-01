import React from 'react';
import PropTypes from 'prop-types';
// import { useRouter } from 'next/router';
import { FormattedMessage } from 'react-intl';

import { getUsername } from '@/utils/user';
import { formatMessage } from '@/services/intl';
import formatMessageTime from '../../utils/formatMessageTime';
import TMessage from '../IMMessage';
import {
  notification as notiMessage,
  role as roleMessage,
} from '../../messages';

function CollaboratorMessage(props) {
  const {
    message: { send_time: sendTime, detail },
    currentUser,
  } = props;

  //   const router = useRouter();

  const isFromCurrentUser = currentUser.uid === detail.user.uid;
  return (
    <TMessage hasAction modifier="system">
      <TMessage.Header>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">
        <span>
          {!detail.is_deleted ? (
            <FormattedMessage
              {...notiMessage.collaboratorChange}
              values={{
                username: (
                  <TMessage.User
                    modifier={isFromCurrentUser ? 'self' : 'other'}
                  >
                    {getUsername(detail.user)}
                  </TMessage.User>
                ),
                identity: formatMessage(roleMessage[detail.role]),
              }}
            />
          ) : (
            <FormattedMessage
              {...notiMessage.collaboratorRemoved}
              values={{
                username: (
                  <TMessage.User
                    modifier={isFromCurrentUser ? 'self' : 'other'}
                  >
                    {getUsername(detail.user)}
                  </TMessage.User>
                ),
              }}
            />
          )}
        </span>
      </TMessage.Content>
    </TMessage>
  );
}

CollaboratorMessage.propTypes = {
  message: PropTypes.object,
  currentUser: PropTypes.object,
};

export default CollaboratorMessage;
