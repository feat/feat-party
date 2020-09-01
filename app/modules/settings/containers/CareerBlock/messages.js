import { defineMessages } from '@/services/intl';

export default defineMessages({
  sectionTitle: {
    id: 'settings.career-section.title',
    defaultMessage: 'Career',
  },
  sectionHint: {
    id: 'settings.career-section.hint',
    defaultMessage: 'Open your employment history to win people trust to you.',
  },
});

export const form = defineMessages({
  organizationLabel: {
    id: 'settings.career-form.organization',
    defaultMessage: 'Company',
  },

  positionLabel: {
    id: 'settings.career-form.position',
    defaultMessage: 'Position',
  },

  descriptionLabel: {
    id: 'settings.career-form.description',
    defaultMessage: 'Description',
  },

  achievementLabel: {
    id: 'settings.career-form.achievement',
    defaultMessage: 'Achievement',
  },

  workingThereLabel: {
    id: 'settings.career-form.working-there',
    defaultMessage: 'Still working there',
  },

  dateFromLabel: {
    id: 'settings.career-form.from',
    defaultMessage: 'From',
  },

  datePlacehodler: {
    id: 'settings.career-form.date-placeholder',
    defaultMessage: 'Date',
  },

  periodLabel: {
    id: 'settings.career-form.period',
    defaultMessage: 'Period',
  },

  periodPlaceholder: {
    id: 'settings.career-form.period-placeholder',
    defaultMessage: 'Range of time',
  },

  imageLabel: {
    id: 'settings.career-form.image-label',
    defaultMessage: 'Image',
  },

  dropImageHint: {
    id: 'settings.career-form.drop-image-hint',
    defaultMessage: 'Drop image here',
  },

  submitLabel: {
    id: 'settings.career-form.submit',
    defaultMessage: 'Save',
  },

  careerCreated: {
    id: 'settings.requests.career-created',
    defaultMessage: 'Career record created.',
  },
  careerCreateFailed: {
    id: 'settings.requests.career-create-failed',
    defaultMessage: 'Failed to create career record.',
  },
  careerDeleted: {
    id: 'settings.requests.career-deleted',
    defaultMessage: 'Career record deleted',
  },
  careerDeleteFailed: {
    id: 'settings.requests.career-delete-failed',
    defaultMessage: 'Failed to remove career record',
  },
});
