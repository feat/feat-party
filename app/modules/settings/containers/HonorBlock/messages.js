import { defineMessages } from '@/services/intl';

export default defineMessages({
  sectionTitle: {
    id: 'settings.honor-section.title',
    defaultMessage: 'Honors & Awards',
  },
  sectionHint: {
    id: 'settings.honor-section.hint',
    defaultMessage: 'Honors',
  },
  
  // --- Honor ---
  honorCreated: {
    id: 'settings.requests.honor-created',
    defaultMessage: 'Honor record created',
  },
  honorCreateFailed: {
    id: 'settings.requests.honor-create-failed',
    defaultMessage: 'Failed to create honor record',
  },
  honorDeleted: {
    id: 'settings.requests.honor-deleted',
    defaultMessage: 'Honor record deleted',
  },
  honorDeleteFailed: {
    id: 'settings.requests.honor-delete-failed',
    defaultMessage: 'Failed to delete honor record',
  },
});

export const form = defineMessages({
  titleLabel: {
    id: 'settings.honor-form.title',
    defaultMessage: 'Title',
  },
  organizationLabel: {
    id: 'settings.honor-form.organization',
    defaultMessage: 'Institute',
  },
  timeLabel: {
    id: 'settings.honor-form.award-time',
    defaultMessage: 'Award Time',
  },
  imageLabel: {
    id: 'settings.honor-form.image',
    defaultMessage: 'Image',
  },
  issuedAtPlaceholder: {
    id: 'settings.honor-form.issued-at-placeholder',
    defaultMessage: 'Date',
  },
  dropImageHint: {
    id: 'settings.honor-form.drop-image-hint',
    defaultMessage: 'Drop image here.',
  },
  submitLabel: {
    id: 'settings.honor-form.submit',
    defaultMessage: 'Submit',
  },
});
