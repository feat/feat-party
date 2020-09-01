import { defineMessages } from '@/services/intl';

export default defineMessages({
  blockTitle: {
    id: 'settings.workplace-section.title',
    defaultMessage: 'Workplace',
  },
  pinAlertTitle: {
    id: 'settings.workplace-section.pin-alert-title',
    defaultMessage: 'Failed to get geolocation',
  },
  pinAlertContent: {
    id: 'settings.workplace-section.pin-alert-content',
    defaultMessage: 'You may need to pin your location on the map.',
  },
  autoFillingHint: {
    id: 'settings.workplace-section.auto-filling-hint',
    defaultMessage: 'Auto Filling, please wait.',
  },
  fillWithCurrentLocation: {
    id: 'settings.workplace-section.fill-with-current-location',
    defaultMessage: 'Click to auto fill with current location info.',
  },
  // --- Workplace ---
  workplaceUpdated: {
    id: 'settings.requests.workplace-updated',
    defaultMessage: 'Workplace Updated',
  },
  setWorkplaceHint: {
    id: 'settings.workplace-section.set-workplace-hint',
    defaultMessage: 'Please set the workplace adddress.',
  },
});
