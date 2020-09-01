import { formatDate } from '@/utils/time';
import { formatMessage } from '@/services/intl';
import {
  ORDER_STATUS_CREATED,
  ORDER_STATUS_PAID,
  ORDER_STATUS_CANCELLING,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_TO_START,
  ORDER_STATUS_FOR_PROVIDER_TO_START,
  ORDER_STATUS_FOR_CONSUMER_TO_START,
  ORDER_STATUS_ON_AIR,
  ORDER_STATUS_PAUSE,
  ORDER_STATUS_FINISHED,
  ORDER_STATUS_WAITING_FOR_REFUND,
  ORDER_STATUS_WAITING_FOR_ARBITRATION,
  ORDER_STATUS_REFUNDING,
  ORDER_STATUS_FUNDING,
  ORDER_STATUS_FULFILL,
  PRICE_UNIT_CASE,
  PRICE_UNIT_HOUR,
} from '../constants';
import {
  orderLog as orderLogMessages,
  servicePriceUnit as servicePriceUnitMessages,
} from '../messages';

export const formatTimeInfo = (data) => {
  if (data.end_time) {
    return `[${formatDate(data.start_time, 'HH:mm')}--${formatDate(
      data.end_time,
      'HH:mm',
    )}]`;
  }
  return `[${formatDate(data.start_time, 'HH:mm')}]`;
};

export const getOrderLogMessage = (log) => {
  const { to_state: status, executor } = log;
  switch (status) {
    case ORDER_STATUS_CREATED:
      return orderLogMessages.created;
    case ORDER_STATUS_CANCELLING:
      if (executor === 'consumer') {
        return orderLogMessages.consumerCancel;
      }
      if (executor === 'provider') {
        return orderLogMessages.providerCancel;
      }
      return orderLogMessages.cancelling;
    case ORDER_STATUS_CANCELED:
      if (executor === 'consumer') {
        return orderLogMessages.consumerCancel;
      }
      if (executor === 'provider') {
        return orderLogMessages.providerCancel;
      }
      return orderLogMessages.canceled;
    case ORDER_STATUS_CONFIRMED:
      return orderLogMessages.providerAccept;
    case ORDER_STATUS_PAID:
      return orderLogMessages.paid;
    case ORDER_STATUS_FOR_CONSUMER_TO_START:
      return orderLogMessages.providerStart;
    case ORDER_STATUS_FOR_PROVIDER_TO_START:
      return orderLogMessages.consumerStart;
    case ORDER_STATUS_TO_START:
      return orderLogMessages.readyToStart;
    case ORDER_STATUS_ON_AIR:
      return orderLogMessages.onAir;
    case ORDER_STATUS_PAUSE:
      return orderLogMessages.pause;
    case ORDER_STATUS_FINISHED:
      return orderLogMessages.maskAsFinished;
    case ORDER_STATUS_WAITING_FOR_REFUND:
      return orderLogMessages.waitingForRefund;
    case ORDER_STATUS_WAITING_FOR_ARBITRATION:
      return orderLogMessages.waitingForArbitration;
    case ORDER_STATUS_REFUNDING:
      return orderLogMessages.refunding;
    case ORDER_STATUS_FUNDING:
      return orderLogMessages.funding;
    case ORDER_STATUS_FULFILL:
      return orderLogMessages.fulfill;
    default:
      return {
        id: `commerce.order-transition-log.${status}`,
        defaultMessage: `Order Status ${status}`,
      };
  }
};

let unitOptions;
export function getUnitOptions() {
  if (!unitOptions) {
    return [
      {
        value: PRICE_UNIT_HOUR,
        label: formatMessage(servicePriceUnitMessages[PRICE_UNIT_HOUR]),
      },
      {
        value: PRICE_UNIT_CASE,
        label: formatMessage(servicePriceUnitMessages[PRICE_UNIT_CASE]),
      },
    ];
  }
  return unitOptions;
}

export function mapAddressInfo(obj) {
  if (!obj) {
    return obj;
  }
  const keys = [
    'address',
    'country_code',
    'level_1',
    'level_2',
    'level_3',
    'level_4',
    'level_5',
    'phone',
    'contact_name',
    'lat',
    'lng',
  ];
  const output = {};
  keys.forEach((key) => {
    if (obj[key]) {
      output[key] = obj[key];
    }
  });
  return output;
}

export function formatSN(str) {
  const match =  /^(?<code>[a-zA-Z]{2,3})(?<num>\d*)$/.exec(str);
  if (!match) {
    return str;
  }
  const num = match.groups.num.replace(/(\d{3})(?=\d)/g, '$1 ');
  return `${match.groups.code} ${num}`;
}