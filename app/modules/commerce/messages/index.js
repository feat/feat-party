import { defineMessages } from '@/services/intl';
import {
  SERVICE_TYPE_ONLINE,
  SERVICE_TYPE_ON_SITE,
  SERVICE_TYPE_WORKPLACE,
  PRICE_UNIT_HOUR,
  PRICE_UNIT_CASE,
  ORDER_STATUS_CREATING,
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
  DEMAND_STATUS_DRAFT,
  DEMAND_STATUS_PUBLISHED,
  DEMAND_STATUS_CLOSED,
  DEMAND_STATUS_PROVIDER_SELECTED,
  DEMAND_STATUS_CANCELED,
} from '../constants';

export default defineMessages({
  emptyRecordHint: {
    id: 'exc.order-dash.no-record-hint',
    defaultMessage: '<NONE>',
  },

  transactionHistoryLabel: {
    id: 'exc.order-field.transaction-history-label',
    defaultMessage: 'Transaction History',
  },

  serviceTypeLabel: {
    id: 'exc.order-field.service-type-label',
    defaultMessage: 'Service Type',
  },

  statusLabel: {
    id: 'exc.order-field.status-label',
    defaultMessage: 'Status',
  },

  bookingLabel: {
    id: 'exc.order-field.booking-label',
    defaultMessage: 'Booking',
  },

  serviceLabel: {
    id: 'exc.order-field.service-label',
    defaultMessage: 'Service',
  },
  providerLabel: {
    id: 'exc.order-field.provider-label',
    defaultMessage: 'Provider',
  },
  buyerLabel: {
    id: 'exc.order-field.buyer-label',
    defaultMessage: 'Buyer',
  },
  timeLabel: {
    id: 'exc.order-field.time-label',
    defaultMessage: 'Time',
  },
  addressLabel: {
    id: 'exc.order-field.address-label',
    defaultMessage: 'Address',
  },
  serviceFeeLabel: {
    id: 'exc.order-field.service-fee-label',
    defaultMessage: 'Service Fee',
  },
  bankChargeLabel: {
    id: 'exc.order-field.bank-charge-label',
    defaultMessage: 'Bank Charge',
  },
  totalAmountLabel: {
    id: 'exc.order-field.total-amount-label',
    defaultMessage: 'Total Amount',
  },
  feeWarning: {
    id: 'exc.order-creation.fee-warning',
    defaultMessage:
      'Currency fluctuations, bank fees, and applicable taxes may charge your final amount. Cancellation policy. No penalty will be charged in case you cancel.',
  },

  availableLabel: {
    id: 'exc.service-status.available-label',
    defaultMessage: 'Available',
  },
  notAvailableLabel: {
    id: 'exc.service-status.not-available-label',
    defaultMessage: 'Not Available',
  },
  paymentLabel: {
    id: 'exc.order-field.payment-label',
    defaultMessage: 'Payment',
  },
  rangeBooking: {
    id: 'exc.order-info.range-booking',
    defaultMessage: '{startTime}--{endTime} on {date}',
  },
  timeBooking: {
    id: 'exc.order-info.time-booking',
    defaultMessage: 'start on {startTime} {date}',
  },
  localTimeHint: {
    id: 'exc.order-creation.local-time-hint',
    defaultMessage: 'This is your local time.',
  },
  selectServiceTime: {
    id: 'exc.order-creation.select-service-time',
    defaultMessage: 'Select Service Time',
  },
  selectAddress: {
    id: 'exc.order-creation.select-address',
    defaultMessage: 'Select An Address',
  },
  reviewYourOrder: {
    id: 'exc.order-creation.review-your-order',
    defaultMessage: 'Review Your Order',
  },
  purchaseOrder: {
    id: 'exc.order-creation.purchase-order',
    defaultMessage: 'Purchase Order',
  },
  payTo: {
    id: 'exc.order-creation.pay-to',
    defaultMessage: 'Pay to:',
  },
  serviceScheduled: {
    id: 'exc.order-creation.service-scheduled',
    defaultMessage: 'Feat Service scheduled',
  },
  payWith: {
    id: 'exc.order-creation.pay-method',
    defaultMessage: 'Pay with:',
  },
  payThrough: {
    id: 'exc.order-creation.pay-through',
    defaultMessage: 'Pay through:',
  },
  beneficiary: {
    id: 'exc.order-creation.beneficiary',
    defaultMessage: 'Beneficiary:',
  },
  orderCreated: {
    id: 'exc.order-creation.order-created',
    defaultMessage: 'Order Created',
  },
  newAddress: {
    id: 'exc.order-creation.new-address',
    defaultMessage: 'New Address',
  },
  newAddressButtonLabel: {
    id: 'exc.order-creation.new-address-button-label',
    defaultMessage: 'Add New Address',
  },
  creatingOrderHint: {
    id: 'exc.order-creation.creating-order',
    defaultMessage: 'Creating Order',
  },
  payNow: {
    id: 'exc.order-creation.pay-now',
    defaultMessage: 'Pay now',
  },
  payLater: {
    id: 'exc.order-creation.pay-later',
    defaultMessage: 'Pay later',
  },
  serviceTimeRequired: {
    id: 'exc.order-creation.service-time-requried',
    defaultMessage: 'Please select service time',
  },
  thanksForOrder: {
    id: 'exc.order-creation.thanks-for-order',
    defaultMessage: 'Thank you',
  },
  defaultLabel: {
    id: 'exc.order-payment.default-account-label',
    defaultMessage: 'default',
  },
  scanWithWechat: {
    id: 'exc.order-payment.pay-with-wechat-scan-code',
    defaultMessage: 'Pay with WeChat scan code',
  },
  scanWithAlipay: {
    id: 'exc.order-payment.pay-with-alipay-scan-code',
    defaultMessage: 'Pay with Alipay scan code',
  },
  loadingPaymentSettings: {
    id: 'exc.order-payment.loading-payment-settings',
    defaultMessage: 'Loading...',
  },
  paymentAccount: {
    id: 'exc.order-payment.payment-account',
    defaultMessage: 'Payment Account',
  },
  selectPayMethod: {
    id: 'exc.order-payment.select-pay-method',
    defaultMessage: 'Select Pay Method',
  },
  addPayAccount: {
    id: 'exc.order-payment.add-pay-account',
    defaultMessage: 'Add Pay Account',
  },
  paymentProcessing: {
    id: 'exc.order-payment.payment-processing',
    defaultMessage: 'Processing Payment...',
  },
  wechatPayInfoError: {
    id: 'exc.order-payment.wechat-pay-info-error',
    defaultMessage: 'Failed to get wechat pay info: {message}',
  },
  alipayInfoError: {
    id: 'exc.order-payment.alipay-info-error',
    defaultMessage: 'Failed to get alipay info',
  },
  newCard: {
    id: 'exc.order-payment.new-card',
    defaultMessage: 'New Card',
  },
  failedToProcessPayment: {
    id: 'exc.order-payment.failed-to-process-payment',
    defaultMessage: 'Failed to process payment',
  },

  payMethodUnionPayWTZ: {
    id: 'exc.pay-method.unionpay-nrd',
    defaultMessage: 'UnionPay(WTZ)',
  },

  payMethodWechatPay: {
    id: 'exc.pay-method.wechat-pay',
    defaultMessage: 'WeChat Pay',
  },

  payMethodAlipay: {
    id: 'exc.pay-method.alipay',
    defaultMessage: 'Alipay',
  },

  // dash
  dateLabel: {
    id: 'exc.order-dash.date-label',
    defaultMessage: 'Date',
  },
  descriptionLabel: {
    id: 'exc.order-dash.description',
    defaultMessage: 'Description',
  },
  quantityLabel: {
    id: 'exc.order-dash.quantity',
    defaultMessage: 'Quantity',
  },
  remarkLabel: {
    id: 'exc.order-dash.remark',
    defaultMessage: 'Remark',
  },
  expenseLabel: {
    id: 'exc.order-dash.expense',
    defaultMessage: 'Expense',
  },
  noSalesOrderHint: {
    id: 'exc.order-dash.no-sales-order-hint',
    defaultMessage: 'No Sales Orders',
  },
  noDemandHint: {
    id: 'exc.order-dash.no-demand-hint',
    defaultMessage: 'No Demand',
  },
  noPurchaseOrderHint: {
    id: 'exc.order-dash.no-purchase-order-hint',
    defaultMessage: 'No Purchase Orders',
  },
  newDemandLabel: {
    id: 'exc.order-dash.new-demand',
    defaultMessage: 'New Demand',
  },
});

export const serviceType = defineMessages({
  [SERVICE_TYPE_ONLINE]: {
    id: 'exc.service-type.online',
    defaultMessage: 'Online',
  },
  [SERVICE_TYPE_ON_SITE]: {
    id: 'exc.service-type.on-site',
    defaultMessage: 'On-Site',
  },
  [SERVICE_TYPE_WORKPLACE]: {
    id: 'exc.service-type.workplace',
    defaultMessage: 'Workplace',
  },
});

export const servicePriceUnit = defineMessages({
  [PRICE_UNIT_CASE]: {
    id: 'exc.service-price-unit.case',
    defaultMessage: 'Case',
  },
  [PRICE_UNIT_HOUR]: {
    id: 'exc.service-price-unit.hour',
    defaultMessage: 'Hour',
  },
});

export const orderStatus = defineMessages({
  [ORDER_STATUS_CREATING]: {
    id: 'exc.order-status.creating',
    defaultMessage: 'Creating',
  },
  [ORDER_STATUS_CREATED]: {
    id: 'exc.order-status.created',
    defaultMessage: 'Created',
  },
  [ORDER_STATUS_PAID]: {
    id: 'exc.order-status.paid',
    defaultMessage: 'Paid',
  },
  [ORDER_STATUS_CANCELLING]: {
    id: 'exc.order-status.cancelling',
    defaultMessage: 'Cancelling',
  },
  [ORDER_STATUS_CANCELED]: {
    id: 'exc.order-status.canceled',
    defaultMessage: 'Canceled',
  },
  [ORDER_STATUS_CONFIRMED]: {
    id: 'exc.order-status.confirmed',
    defaultMessage: 'Confirmed',
  },
  [ORDER_STATUS_TO_START]: {
    id: 'exc.order-status.to-start',
    defaultMessage: 'To Start',
  },
  [ORDER_STATUS_FOR_PROVIDER_TO_START]: {
    id: 'exc.order-status.for-provider-to-start',
    defaultMessage: 'For Provider to Start',
  },
  [ORDER_STATUS_FOR_CONSUMER_TO_START]: {
    id: 'exc.order-status.for-consumer-to-start',
    defaultMessage: 'For Consumer to start',
  },
  [ORDER_STATUS_ON_AIR]: {
    id: 'exc.order-status.on-air',
    defaultMessage: 'On Air',
  },
  [ORDER_STATUS_PAUSE]: {
    id: 'exc.order-status.pause',
    defaultMessage: 'Pause',
  },
  [ORDER_STATUS_FINISHED]: {
    id: 'exc.order-status.finished',
    defaultMessage: 'Finished',
  },
  [ORDER_STATUS_WAITING_FOR_REFUND]: {
    id: 'exc.order-status.waiting-for-refund',
    defaultMessage: 'Waiting for Refund',
  },
  [ORDER_STATUS_WAITING_FOR_ARBITRATION]: {
    id: 'exc.order-status.waiting-for-arbitration',
    defaultMessage: 'Waiting for Arbitration',
  },
  [ORDER_STATUS_REFUNDING]: {
    id: 'exc.order-status.refunding',
    defaultMessage: 'Refunding',
  },
  [ORDER_STATUS_FUNDING]: {
    id: 'exc.order-status.funding',
    defaultMessage: 'Funding',
  },
  [ORDER_STATUS_FULFILL]: {
    id: 'exc.order-status.fulfill',
    defaultMessage: 'Fulfill',
  },
});

export const orderAction = defineMessages({
  cancel: {
    id: 'exc.order-action.cancel',
    defaultMessage: 'Cancel',
  },
  pay: {
    id: 'exc.order-action.pay',
    defaultMessage: 'Pay',
  },
  start: {
    id: 'exc.order-action.start',
    defaultMessage: 'Start',
  },
  refund: {
    id: 'exc.order-action.refund',
    defaultMessage: 'Refund',
  },
  confirmFinished: {
    id: 'exc.order-action.confirm-finished',
    defaultMessage: 'Confirm Finished',
  },
  cancelRefund: {
    id: 'exc.order-action.cancel-refund',
    defaultMessage: 'Cancel Refund',
  },
  confirmStart: {
    id: 'exc.order-action.confirm-start',
    defaultMessage: 'Confirm Start',
  },
  agreeToRefund: {
    id: 'exc.order-action.agree-to-refund',
    defaultMessage: 'Agree to refund',
  },
  rejectToRefund: {
    id: 'exc.order-action.reject-to-refund',
    defaultMessage: 'Reject',
  },
  accept: {
    id: 'exc.order-action.accept',
    defaultMessage: 'Accept',
  },
  reject: {
    id: 'exc.order-action.reject',
    defaultMessage: 'Reject',
  },
});

export const orderLog = defineMessages({
  created: {
    id: 'exc.order-transition-log.created',
    defaultMessage: 'Buyer place purchase order to seller',
  },
  paid: {
    id: 'exc.order-transition-log.paid',
    defaultMessage: 'Buyer sends payment to feat.com',
  },
  systemCancel: {
    id: 'exc.order-transition-log.system-cancel',
    defaultMessage: 'Order canceled automatically.',
  },
  providerCancel: {
    id: 'exc.order-transition-log.provider-cancel',
    defaultMessage: 'Order canceled by seller.',
  },
  consumerCancel: {
    id: 'exc.order-transition-log.consumer-cancel',
    defaultMessage: 'Order canceled by buyer.',
  },
  providerAccept: {
    id: 'exc.order-transition-log.provider-accept',
    defaultMessage: 'Order confirmed by seller.',
  },
  providerReject: {
    id: 'exc.order-transition-log.provider-reject',
    defaultMessage: 'Order rejected by seller.',
  },
  cancelling: {
    id: 'exc.order-transition-log.cancelling',
    defaultMessage: 'Order Cancelling.',
  },
  canceled: {
    id: 'exc.order-transition-log.canceled',
    defaultMessage: 'Order canceled.',
  },
  readyToStart: {
    id: 'exc.order-transition-log.to-start',
    defaultMessage: 'Order is ready to start',
  },
  providerStart: {
    id: 'exc.order-transition-log.provider-start',
    defaultMessage: 'Seller trigger start',
  },
  consumerStart: {
    id: 'exc.order-transition-log.consumer-start',
    defaultMessage: 'Buyer trigger start',
  },
  onAir: {
    id: 'exc.order-transition-log.on-air',
    defaultMessage: 'Service in progress',
  },
  pause: {
    id: 'exc.order-transition-log.pause',
    defaultMessage: 'Service suspension',
  },
  maskAsFinished: {
    id: 'exc.order-transition-log.mark-as-finished',
    defaultMessage: 'Order comes to finished.',
  },
  waitingForRefund: {
    id: 'exc.order-transition-log.waiting-for-refund',
    defaultMessage: 'Waiting for refund',
  },
  waitingForArbitration: {
    id: 'exc.order-transition-log.waiting-for-arbitration',
    defaultMessage: 'Waiting for arbitration',
  },
  refunding: {
    id: 'exc.order-transition-log.refunding',
    defaultMessage: 'Refunding',
  },
  funding: {
    id: 'exc.order-transition-log.funding',
    defaultMessage: 'funding',
  },
  fulfill: {
    id: 'exc.order-transition-log.fulfill',
    defaultMessage: 'Order is fulfilled.',
  },
  unknown: {
    id: 'exc.order-transition-log.unknown',
    defaultMessage: 'Unknown log info.',
  },
});

export const demandStatus = defineMessages(
  {
    [DEMAND_STATUS_DRAFT]: {
      id: 'exc.demand-status.draft',
      defaultMessage: 'Draft',
    },
    [DEMAND_STATUS_PUBLISHED]: {
      id: 'exc.demand-status.published',
      defaultMessage: 'Published',
    },
    [DEMAND_STATUS_CLOSED]: {
      id: 'exc.demand-status.closed',
      defaultMessage: 'Closed',
    },
    [DEMAND_STATUS_PROVIDER_SELECTED]: {
      id: 'exc.demand-status.provider-selected',
      defaultMessage: 'Provider Selected',
    },
    [DEMAND_STATUS_CANCELED]: {
      id: 'exc.demand-status.canceled',
      defaultMessage: 'Canceled',
    },
  },
  { prefix: 'undefined demand status message: ' },
);
