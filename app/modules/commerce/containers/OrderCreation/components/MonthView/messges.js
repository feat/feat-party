import { defineMessages } from '@/services/intl';

export default defineMessages({
  followingIsNotAvailable: {
    id: 'commerce.month-view.following-is-not-available',
    defaultMessage: 'The following period is not available.',
  },
  allAreAvailable: {
    id: 'commerce.month-view.all-are-available',
    defaultMessage: 'All service hours can be selected.',
  },
  selectedDurationDesc: {
    id: 'commerce.month-view.selected-duration-desc',
    defaultMessage:
      "You have chosen the following duration (This is viewer's local time.)",
  },
  durationInfo: {
    id: 'commerce.month-view.duration-info',
    defaultMessage:
      '{startHour}:{startMinute} -- {endHour}:{endMinute} on {date}',
  },
  dateInfo: {
    id: 'commerce.month-view.date-info',
    defaultMessage: 'On {date}',
  },
  selectStartTimeHint: {
    id: 'commerce.month-view.select-start-time-hint',
    defaultMessage: 'Please select the start time',
  },
});
