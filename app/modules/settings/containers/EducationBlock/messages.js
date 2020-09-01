import { defineMessages } from '@/services/intl';

export default defineMessages({
  sectionTitle: {
    id: 'settings.education-section.title',
    defaultMessage: 'Education',
  },
  sectionHint: {
    id: 'settings.education-section.hint',
    defaultMessage: 'More buddies join your circle more truth worthy you are.',
  },
  // requests
  educationCreated: {
    id: 'settings.requests.education-created',
    defaultMessage: 'Education Record Created',
  },
  educationCreateFailed: {
    id: 'settings.requests.education-create-failed',
    defaultMessage: 'Failed to create education record',
  },
  educationDeleted: {
    id: 'settings.requests.education-deleted',
    defaultMessage: 'Education Record Deleted',
  },
  educationDeleteFailed: {
    id: 'settings.requests.education-delete-failed',
    defaultMessage: 'Failed to remove education record',
  },
});

export const form = defineMessages({
  periodPlaceholder: {
    id: 'settings.education-form.period-placeholder',
    defaultMessage: 'Range Of Time',
  },
  saveLabel: {
    id: 'settings.education-form.save-label',
    defaultMessage: 'Save',
  },
  typeLabel: {
    id: 'settings.education-form.type',
    defaultMessage: 'Type',
  },
  organizationLabel: {
    id: 'settings.education-form.organization',
    defaultMessage: 'Organization',
  },
  subjectLabel: {
    id: 'settings.education-form.subject',
    defaultMessage: 'Subject / Major',
  },
  cityLabel: {
    id: 'settings.education-form.city',
    defaultMessage: 'City',
  },
  periodLabel: {
    id: 'settings.education-form.period',
    defaultMessage: 'Period',
  },
  descriptionLabel: {
    id: 'settings.education-form.description',
    defaultMessage: 'Description',
  },
  imageLabel: {
    id: 'settings.education-form.image',
    defaultMessage: 'Certificate',
  },
  dropImageHint: {
    id: 'settings.education-form.drop-image-hint',
    defaultMessage: 'Drop image here',
  },
});
