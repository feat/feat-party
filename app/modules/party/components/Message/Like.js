import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';
import { like } from '../../messages';

const LikeMessage = (props) => {
  const {
    message: { send_time: sendTime, detail, from_user, from_name },
  } = props;

  const formatted = (
    <FormattedMessage
      {...like[detail.action]}
      values={{
        username: from_name || from_user,
        entityType: detail.target.type,
        entity: detail.target.title,
      }}
    />
  );
  return (
    <TMessage>
      <TMessage.Header>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content>{formatted}</TMessage.Content>
    </TMessage>
  );
};

LikeMessage.propTypes = {
  message: PropTypes.object,
};

export default LikeMessage;
