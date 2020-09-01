import { defineMessages } from '@/services/intl';

export default defineMessages({
  blockTitle: {
    id: 'exc.demand-creation.block-title',
    defaultMessage: 'New Demand',
  },
  titleLabel: {
    id: 'exc.demand-creation.title-label',
    defaultMessage: 'Title',
  },

  titlePlaceholder: {
    id: 'exc.demand-creation.title-placeholder',
    defaultMessage: 'Give A Title For Your Demand Here Please.',
  },
  descriptionLabel: {
    id: 'exc.demand-creation.description-label',
    defaultMessage: 'Description',
  },
  descriptionPlaceholder: {
    id: 'exc.demand-creation.description-placeholder',
    defaultMessage: 'Description',
  },
  imageLabel: {
    id: 'exc.demand-creation.image-label',
    defaultMessage: 'Image',
  },
  dndHint: {
    id: 'exc.demand-creation.dnd-hint',
    defaultMessage: 'Drag & Drop Supported',
  },
  serviceLabel: {
    id: 'exc.demand-creation.service-label',
    defaultMessage: 'Service',
  },
  addressLabel: {
    id: 'exc.demand-creation.address-label',
    defaultMessage: 'Address',
  },
  paymentLabel: {
    id: 'exc.demand-creation.payment-label',
    defaultMessage: 'Payment',
  },
  closeDateLabel: {
    id: 'exc.demand-creation.close-date-label',
    defaultMessage: 'Close Date',
  },
  dateRequiredLabel: {
    id: 'exc.demand-creation.date-required-label',
    defaultMessage: 'Date Required',
  },
  selectCategoryHint: {
    id: 'exc.demand-creation.select-category-hint',
    defaultMessage: 'Please check a class that maybe most close to this demand',
  },
  autoCloseMessage: {
    id: 'exc.demand-creation.auto-close-message',
    defaultMessage:
      'Demand will be automatically closed 7 days before the required date.',
  },
  selectAnAddress: {
    id: 'exc.demand-creation.select-an-address',
    defaultMessage: 'Select an address',
  },
  setDateRequiredFirst: {
    id: 'exc.demand-creation.set-date-required-first',
    defaultMessage: 'Please set "date requried" first.',
  },
  tagRequired: {
    id: 'exc.demand-creation.tag-required',
    defaultMessage: 'Please set at least one tag.',
  },
  tagPlaceholder: {
    id: 'exc.demand-creation.tag-placeholder',
    defaultMessage: 'Tags of your demand.[Enter]',
  },
  creatingDemand: {
    id: 'exc.demand-creation.creating-demand',
    defaultMessage: 'Creating Demand',
  },
});
