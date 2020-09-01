import { defineMessages } from '@/services/intl';

export default defineMessages({
  languageSectionTitle: {
    id: 'settings.language-section.title',
    defaultMessage: 'Languages',
  },
  languageSectionHint: {
    id: 'settings.language-section.hint',
    defaultMessage:
      'Please select your mothertongue and foreign Langues abilities.',
  },
  // --- Language ---
  languageAddSuccess: {
    id: 'settings.requests.language-added',
    defaultMessage: 'Language added.',
  },
  languageAddFailed: {
    id: 'settings.requests.language-add-failed',
    defaultMessage: 'Failed to add language',
  },
  languageDeleteSuccess: {
    id: 'settings.requests.language-deleted',
    defaultMessage: 'Language {label} deleted',
  },
  languageDeleteFailed: {
    id: 'settings.requests.language-failed',
    defaultMessage: 'Failed to remove language',
  },
  languageUpdateSuccess: {
    id: 'settings.requests.language-updated',
    defaultMessage: 'Language updated.',
  },
  languageUpdateFailed: {
    id: 'settings.requests.language-update-failed',
    defaultMessage: 'Error for language update',
  },
});
