import { defineMessages } from '@/services/intl';

export default defineMessages({
  sectionTitle: {
    id: 'settings.account-basic-section.title',
    defaultMessage: 'Basic',
  },
  userIdLabel: {
    id: 'settings.account-basic-section.user-id',
    defaultMessage: 'User ID',
  },
  userDomainLabel: {
    id: 'settings.account-basic-section.user-domain',
    defaultMessage: 'Private Home Page',
  },
  userDomainTooltip: {
    id: 'settings.accoutn-basic-section.user-domain-tooltip',
    defaultMessage: 'You can only input once.',
  },
  contactLabel: {
    id: 'settings.account-basic-section.contact',
    defaultMessage: 'Contact',
  },
  setHomeDomainSuccess: {
    id: 'settings.requests.set-home-domain-success',
    defaultMessage: 'Success to set home domain',
  },
});
