import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';

import { messages as partyMessages } from '../../messages';

const OrderErrorMessage = (props) => {
  const { message } = props;
  const { send_time: sendTime } = message;

  const formatted = (
    <FormattedMessage 
      {...partyMessages.orderError}
    />
  )

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

OrderErrorMessage.propTypes = {
  message: PropTypes.object,
};

export default OrderErrorMessage;
