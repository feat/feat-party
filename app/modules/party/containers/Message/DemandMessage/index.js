import React from 'react';
import { formatMessage } from '@/services/intl';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import { orderStatus as orderStatusMessages } from '@/modules/commerce/messages';
import messagePropTypes from '../propTypes';
import formatMessageTime from '../../../utils/formatMessageTime';
import TMessage from '../../../components/IMMessage';

import { order as orderdMessages } from '../../../messages';

import {
  CONTACT_LIST_STATUS_CREATED,
} from '../../../constants';

import OrderCard from './OrderCard';


class OrderMessage extends React.PureComponent {

  getSenderLabel() {
    const { message, isFromCurrentUser, contacts } = this.props;
    const n =
      contacts &&
      Object.values(contacts).find((item) => message.from_user === item.friend);
    if (isFromCurrentUser) {
      return 'You';
    }
    if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
      return n.friend_fullname;
    }
    return message.from_name || message.from_user;
  }

  getReceiverLabel() {
    const { message, isToCurrentUser, tabItem, contacts } = this.props;

    const n =
      contacts &&
      Object.values(contacts).find((item) => message.to_user === item.friend);
    if (tabItem === 'archive') {
      if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
        return isToCurrentUser ? 'You' : n.friend_fullname;
      }
      return isToCurrentUser ? 'You' : message.to_name || message.to_user;
    }
    if (!message.to_user) {
      return null;
    }
    if (!!n && n.status === CONTACT_LIST_STATUS_CREATED) {
      return n.friend_fullname;
    }
    return isToCurrentUser ? 'You' : message.to_name || message.to_user;
  }


  render() {
    const { message, currentUser, isFromCurrentUser, isToCurrentUser } = this.props;

    const {
      send_time: sendTime,
      detail: {
        title,
        start_time: startTime,
        end_time: endTime,
        description,
        provider,
        consumer,
        sn,
        status,
        code,
      } = {},
    } = message;
    const senderLabel = this.getSenderLabel();
    const receiverLabel = this.getReceiverLabel();

    let content;
    if (code === 'CONSUMER_EXISTS_ON_AIR_DEMAND') {
      content = (
        <TranslatableMessage
          message={orderdMessages.consumerBusy}
          values={{
            orderName: title,
          }}
        />
      )
    } else if (code === 'PROVIDER_EXISTS_ON_AIR_DEMAND') {
      content = (
        <TranslatableMessage
          message={orderdMessages.providerBusy}
          values={{
            orderName: title,
          }}
        />
      )
    } else {
      content = (
        <TranslatableMessage
          message={orderdMessages[status]}
          values={{
            orderName: title,
            status: formatMessage(orderStatusMessages[status]),
          }}
        />
      )
    }
    return (
      <TMessage modifier="order">
        <TMessage.Header>
          <TMessage.Desc>
            {senderLabel && <TMessage.User modifier={isFromCurrentUser ? 'self' : 'other'}>
              {`${senderLabel}`}
            </TMessage.User>}
            {senderLabel && receiverLabel && <span> ›› </span>}
            {receiverLabel && <TMessage.User modifier={isToCurrentUser ? 'self' : 'other'}>
              {receiverLabel}
            </TMessage.User>}
          </TMessage.Desc>
          <TMessage.Meta>
            <TMessage.Time>
              {formatMessageTime(sendTime)}
            </TMessage.Time>
          </TMessage.Meta>
        </TMessage.Header>
        <TMessage.Content modifier="order">
          <TMessage.Text>
            {content}
          </TMessage.Text>
          {sn && (
            <OrderCard
              role={currentUser.uid === provider.uid ? 'provider' : 'consumer'}
              sn={sn}
              consumer={consumer.username || `${consumer.uid}`}
              provider={provider.username || `${provider.uid}`}
              title={title}
              description={description}
              startTime={startTime}
              endTime={endTime}
            />
          )}
        </TMessage.Content>
      </TMessage>
    );
  }
}

OrderMessage.propTypes = messagePropTypes;

export default OrderMessage;
