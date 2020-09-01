import { defineMessages } from '@/services/intl';

export default defineMessages({
  title: {
    id: 'exc.wtz-account-form.title',
    defaultMessage: 'Unionpay WTZ',
  },
  sendingVcode: {
    id: 'exc.wtz-account-form.sending-vcode',
    defaultMessage: 'Sending Vcode',
  },
  resendVcode: {
    id: 'exc.wtz-account-form.resend-vcode',
    defaultMessage: 'Resend Vcode',
  },
  sendVcode: {
    id: 'exc.wtz-account-form.send-vcode',
    defaultMessage: 'Send Vcode',
  },
  inputVcodeHint: {
    id: 'exc.wtz-account-form.input-vcode-hint',
    defaultMessage: 'Please input the vcode sent to your phone.',
  },
  failedToGetVcode: {
    id: 'exc.wtz-account-form.failed-to-get-code',
    defaultMessage: 'Failed to get code',
  },
  countdownMessage: {
    id: 'exc.wtz-account-form.count-down-message',
    defaultMessage: '{time}s',
  },
  invalidVcode: {
    id: 'exc.wtz-account-form.invalid-vcode',
    defaultMessage: 'Invalid Vcode',
  },
});
