import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';
import { commentHeader } from '../../messages';

const CommentMessage = (props) => {
  const {
    message: { send_time: sendTime, detail, from_user, from_name },
  } = props;

  const formattedHeader = (
    <FormattedMessage
      {...commentHeader[detail.action]}
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
        <span className="margin_r_5">{formattedHeader}</span>
        <TMessage.Meta>
          <TMessage.Time>{formatMessageTime(sendTime)}</TMessage.Time>
        </TMessage.Meta>
      </TMessage.Header>
      <TMessage.Content>
        <div dangerouslySetInnerHTML={{ __html: detail.comment_content }} />
      </TMessage.Content>
    </TMessage>
  );
};

CommentMessage.propTypes = {
  message: PropTypes.object,
};

export default CommentMessage;
