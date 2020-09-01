import { defineMessages } from '@/services/intl';
import {
  PAY_METHOD_ALIPAY,
  PAY_METHOD_UNIONPAY,
  PAY_METHOD_WECHATPAY,
  PAY_METHOD_DUMMY,
} from './constants';

export default defineMessages({
  sectionTitle: {
    id: 'settings.payment-section.title',
    defaultMessage: 'Payment',
  },
  currencyLabel: {
    id: 'settings.payment-section.currency',
    defaultMessage: 'Currency',
  },
  accountsLabel: {
    id: 'settings.payment-sections.account',
    defaultMessage: 'Accounts',
  },
  setAsDefaultReceipt: {
    id: 'settings.payment-sections.as-default-receipt',
    defaultMessage: 'Default Receipt Account',
  },
  setAsDefaultPayment: {
    id: 'settings.payment-sections.as-default-payment',
    defaultMessage: 'Default Payment Account',
  },

  // --- Payment ---
  defaultPaymentAccountUpdated: {
    id: 'settings.requests.default-payment-account-updated',
    defaultMessage: 'The default payment account has been updated.',
  },
  defaultReceiptAccountUpdated: {
    id: 'settings.requests.default-receipt-account-updated',
    defaultMessage: 'The default receipt account has been updated.',
  },
  paymentSettingsUpdated: {
    id: 'settings.requests.payment-settings-updated',
    defaultMessage: 'Payment settings have been updated.',
  },
  paymentAccountDeleted: {
    id: 'settings.requests.payment-account-deleted',
    defaultMessage: 'Payment account deleted.',
  },
});

export const paymentAccountForm = defineMessages({
  payMethod: {
    id: 'settings.payment-account-form.pay-method',
    defaultMessage: 'Pay Method',
  },
  accountNo: {
    id: 'settings.payment-account-form.account-no',
    defaultMessage: 'Account no',
  },
  expires: {
    id: 'settings.payment-account-form.expires',
    defaultMessage: 'Expires',
  },
  phone: {
    id: 'settings.payment-account-form.phone',
    defaultMessage: 'Phone',
  },
  vcode: {
    id: 'settings.payment-account-form.vcode',
    defaultMessage: 'Vcode',
  },
  asDefaultReceiptAccount: {
    id: 'settings.payment-account-form.as-default-receipt',
    defaultMessage: 'Default Receipt Account',
  },
  asDefaultPaymentAccount: {
    id: 'settings.payment-account-form.as-default-payment',
    defaultMessage: 'Default Payment Account',
  },
  submit: {
    id: 'settings.payment-account-form.submit',
    defaultMessage: 'Submit',
  },
  sendCodeLabel: {
    id: 'settings.payment-account-form.send-code',
    defaultMessage: 'Send Code',
  },
  popWindowBlockedTitle: {
    id: 'settings.payment-account-form.pop-window-blocked-title',
    defaultMessage: 'Unionpay Wtz service is not active',
  },
  popWindowBlockedDesc: {
    id: 'settings.payment-account-form.pop-window-blocked-desc',
    defaultMessage:
      'You may need to unblock pop window to open unionpay wtz service',
  },
  uniBindSucceeded: {
    id: 'settings.payment-account-form.uni-bind-succeeded',
    defaultMessage: 'Account bind succeeded',
  },
  uniCodeSentTitle: {
    id: 'settings.payment-account-form.uni-code-sent',
    defaultMessage: 'Verification code sent.',
  },
});

export const payMethod = defineMessages({
  [PAY_METHOD_ALIPAY]: {
    id: 'settings.pay-method.alipay',
    defaultMessage: 'Alipay',
  },
  [PAY_METHOD_UNIONPAY]: {
    id: 'settings.pay-method.unionpay',
    defaultMessage: 'Union Pay',
  },
  [PAY_METHOD_WECHATPAY]: {
    id: 'settings.pay-method.wechatpay',
    defaultMessage: 'Wechat Pay',
  },
  [PAY_METHOD_DUMMY]: {
    id: 'settings.pay-method.dummy',
    defaultMessage: 'Dummy',
  },
});
