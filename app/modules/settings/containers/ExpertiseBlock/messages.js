import { defineMessages } from '@/services/intl';

export default defineMessages({
  expertiseSectionTitle: {
    id: 'settings.expertise-section.title',
    defaultMessage: 'Expertise',
  },
  expertiseSectionHint: {
    id: 'settings.expertise-section.hint',
    defaultMessage:
      'Please just list the operations you are most expertised in your community. People just rent Number One.',
  },
  expertisePrimaryControl: {
    id: 'settings.expertise-section.primary-control',
    defaultMessage: 'This is your primary expertise.',
  },
  expertisePrimaryControlDesc: {
    id: 'settings.expertise-section.primary-control-desc',
    defaultMessage: 'You can not delete primary expertise when you have other expertises.',
  },

  expertiseAddLabel: {
    id: 'settings.expertise-section.add',
    defaultMessage: 'Add Expertise',
  },
  expertiseServiceLabel: {
    id: 'settings.expertise-section.service',
    defaultMessage: 'Service',
  },
  primary: {
    id: 'settings.expertise-section.primary',
    defaultMessage: 'Primary',
  },

  expertiseCreated: {
    id: 'settings.requests.expertise-created',
    defaultMessage: 'Expertise created.',
  },
  expertiseCreateFailed: {
    id: 'settings.requests.expertise-create-failed',
    defaultMessage: 'Failed to create expertise',
  },
  expertiseUpdated: {
    id: 'settings.requests.expertise-updated',
    defaultMessage: 'Expertise updated.',
  },
  expertiseUpdateFailed: {
    id: 'settings.requests.expertise-update-failed',
    defaultMessage: 'Failed to update expertise',
  },
  expertiseDeleted: {
    id: 'settings.requests.expertise-deleted',
    defaultMessage: 'Expertise deleted.',
  },
  expertiseDeleteFailed: {
    id: 'settings.requests.expertise-delete-failed',
    defaultMessage: 'Failed to remove expertise',
  },
});

export const form = defineMessages({
  nameLabel: {
    id: 'settings.expertise-form.name',
    defaultMessage: 'Expertise',
  },
  namePlaceholder: {
    id: 'settings.expertise-form.name-placeholder',
    defaultMessage: 'Input Your Expertise',
  },
  applySceneLabel: {
    id: 'settings.expertise-form.apply-scene',
    defaultMessage: 'Apply Scenes',
  },
  applyScenePlaceholder: {
    id: 'settings.expertise-form.apply-scene-placeholder',
    defaultMessage: 'New Application Secene, [ENTER] to confirm',
  },
  categoryLabel: {
    id: 'settings.expertise-form.category',
    defaultMessage: 'Profession Category',
  },
  categoryPlaceholder: {
    id: 'settings.expertise-form.category-placeholder',
    defaultMessage: 'New a profession, [ENTER] to confirm',
  },
  expCategoryLabel: {
    id: 'settings.expertise-form.exp-category',
    defaultMessage: 'Expertise Category',
  },
  expCategoryPlaceholder: {
    id: 'settings.expertise-form.exp-category-placeholder',
    defaultMessage: 'Select an expertise category',
  },
  setAsPrimaryLabel: {
    id: 'settings.expertise-form.set-as-primary',
    defaultMessage: 'Set As Primary',
  },
  servicePrice: {
    id: 'settings.expertise-form.service-price',
    defaultMessage: 'Service Price',
  },
  perHour: {
    id: 'settings.expertise-form.per-hour',
    defaultMessage: 'per hour',
  },
  perCase: {
    id: 'settings.expertise-form.per-case',
    defaultMessage: 'per case',
  },
});
