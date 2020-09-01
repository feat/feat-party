import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { getUsername } from '@/utils/user';
import TMessage from '../IMMessage';
import formatMessageTime from '../../utils/formatMessageTime';

import { messages as partyMessages } from '../../messages';
import OrderCard from '../../containers/Message/DemandMessage/OrderCard';

const ReceivingAccountMessage = (props) => {
  const { message, currentUser } = props;
  const { send_time: sendTime, detail } = message;

  const formatted = (
    <FormattedMessage 
      {...partyMessages.receivingAccountMissing}
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
      {detail && (
        <OrderCard
          role={currentUser.uid === detail.provider.uid ? 'provider' : 'consumer'}
          sn={detail.sn}
          consumer={getUsername(detail.consumer)}
          provider={getUsername(detail.provider)}
          title={detail.title}
          description={detail.description}
          startTime={detail.start_time}
          endTime={detail.end_time}
        />
      )}
    </TMessage>
  );
};

ReceivingAccountMessage.propTypes = {
  message: PropTypes.object,
};

export default ReceivingAccountMessage;
