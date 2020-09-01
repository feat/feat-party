import { defineMessages } from '@/services/intl';

export default defineMessages({
  panelTitle: {
    id: 'exc.pay-method-panel.panel-title',
    defaultMessage: 'Transaction Account',
  },
  panelMessage: {
    id: 'exc.pay-method-panel.panel-message',
    defaultMessage:
      'You must have a transaction account to buy or sell on feat.com. To set up this account, a credit card is required.',
  },
  windowHasBeenBlocked: {
    id: 'exc.pay-method-panel.window-has-been-blocked',
    defaultMessage: 'Window has been blocked.',
  },
  cardNumber: {
    id: 'exc.pay-method-panel.card-number',
    defaultMessage: 'Card Number',
  },
  vcode: {
    id: 'exc.pay-method-panel.vcode',
    defaultMessage: 'Code',
  },
  expires: {
    id: 'exc.pay-method-panel.expires',
    defaultMessage: 'Expires',
  },
  cvc: {
    id: 'exc.pay-method-panel.cvc',
    defaultMessage: 'CVC',
  },
  phone: {
    id: 'exc.pay-method-panel.phone',
    defaultMessage: 'Phone',
  },
  name: {
    id: 'exc.pay-method-panel.name',
    defaultMessage: 'Name',
  },

  unionpayCodeSent: {
    id: 'exc.pay-method-panel.unionpay-code-sent',
    defaultMessage: 'vcode has been sent to {phone}',
  },
  unionpayOpenNow: {
    id: 'exc.pay-method-panel.unionpay-open-now',
    defaultMessage: 'Open Now',
  },
  unionpayOpenQuery: {
    id: 'exc.pay-method-panel.unionpay-open-query',
    defaultMessage: 'Open Query',
  },
  unionpayOpenQueryRetry: {
    id: 'exc.pay-method-panel.unionpay-open-query-retry',
    defaultMessage: 'Retry',
  },
  unionpayInvalidVcode: {
    id: 'exc.pay-method-panel.unionpay-invalid-vcode',
    defaultMessage: 'Invalid Vcode.',
  },
  unionpayCardIsNotActive: {
    id: 'exc.pay-method-panel.unionpay-card-is-not-active',
    defaultMessage: 'Card has not opened wtz.',
  },
  unionpayRecheck: {
    id: 'exc.pay-method-panel.unionpay-recheck',
    defaultMessage: 'Has Opened',
  },
  sendingCode: {
    id: 'exc.pay-method-panel.sending-code',
    defaultMessage: 'Sending Code',
  },
  resendVcode: {
    id: 'exc.pay-method-panel.resend-vcode',
    defaultMessage: 'Resend Vcode',
  },
  sendVcode: {
    id: 'exc.pay-method-panel.send-vcode',
    defaultMessage: 'Send Vcode',
  },
  countdownMessage: {
    id: 'exc.pay-method-panel.count-down-message',
    defaultMessage: '{time}s',
  },
});
