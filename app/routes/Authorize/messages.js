import { defineMessages } from '@/services/intl';

export default defineMessages({
  formTitle: {
    id: 'oauth.authorize-form.title',
    defaultMessage: 'Authorize {appName}',
  },
  cancel: {
    id: 'oauth.authorize-form.cancel',
    defaultMessage: 'Cancel',
  },
  authorize: {
    id: 'oauth.authorize-form.authorize',
    defaultMessage: 'Authorize',
  },
  basicScope: {
    id: 'oauth.authorize-form.basic-scope',
    defaultMessage: 'Basic',
  },
  advancedScope: {
    id: 'oauth.authorize-form.advanced-scope',
    defaultMessage: 'Advanced',
  },
});
