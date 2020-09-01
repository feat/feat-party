import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// import { getAppLink } from '@/utils/user';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';
import {
  MESSAGE_TYPE_GROUP_NEW,
  MESSAGE_TYPE_GROUP_RENAME,
  MESSAGE_TYPE_GROUP_NEW_MEMBER,
  MESSAGE_TYPE_GROUP_BLACK,
  MESSAGE_TYPE_GROUP_UNBLACK,
  MESSAGE_TYPE_GROUP_DISMISS,
  MESSAGE_TYPE_GROUP_RESTORE,
  MESSAGE_TYPE_GROUP_MERGE_REQUEST_REJECT,
  MESSAGE_TYPE_GROUP_MEMBER_REMOVE,
  MESSAGE_TYPE_GROUP_MEMBER_RESTORE,
} from '../../constants';
import { messages as partyMessages, token, groupMerge } from '../../messages';

const SystemMessage = (props) => {
  const { message } = props;
  const { send_time: sendTime } = message;

  let formatted;

  switch (message.message_type) {
    case MESSAGE_TYPE_GROUP_NEW:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupCreated}
          values={{
            groupName: message.detail.group_name,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_RENAME:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupRenamed}
          values={{
            groupName: message.detail.group_name,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_NEW_MEMBER:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupNewMember}
          values={{
            username: message.detail.new_member ? message.detail.new_member.map((user) => user.username || user.uid).join(', ') : undefined,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_BLACK:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupMemberLeft}
          values={{
            username: (
              <span className='t-username'>
                {message.detail.username || message.detail.uid}
              </span>
            ),
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_UNBLACK:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupMemberRejoined}
          values={{
            username: (
              <span>
                {message.detail.username || message.detail.uid}
              </span>
            ),
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_DISMISS:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupDismissed}
          values={{
            groupName: message.detail.group_name,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_RESTORE:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupRestored}
          values={{
            groupName: message.detail.group_name,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_MERGE_REQUEST_REJECT:
      formatted = (
        <FormattedMessage
          {...groupMerge.rejected}
          values={{
            sourceGroup: message.detail.source_group_name,
            targetGroup: message.detail.target_group_name,
            username: <FormattedMessage {...token.firstPersonSubject} />,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_MEMBER_REMOVE:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupMemberRemoved}
          values={{
            username: message.detail.username || message.detail.uid,
          }}
        />
      );
      break;
    case MESSAGE_TYPE_GROUP_MEMBER_RESTORE:
      formatted = (
        <FormattedMessage
          {...partyMessages.groupMemberRestored}
          values={{
            username: message.detail.username || message.detail.uid,
          }}
        />
      )
      break;
    default:
      formatted = `to handle: ${message.message_type}`;
  }

  return (
    <TMessage modifier="system">
      <TMessage.Header>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content modifier="system">{formatted}</TMessage.Content>
    </TMessage>
  );
};

SystemMessage.propTypes = {
  message: PropTypes.object,
};

export default SystemMessage;
