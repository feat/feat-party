// import moment from 'moment';
import { DateTime } from 'luxon';

// export default function formatMessageTime(date) {
//   return moment
//     .utc(date)
//     .local()
//     .format(' YYYY MM DD HH:mm:ss ');
// }

export function formatLocalTime(date, format = 'HH:mm:ss', timezone) {
  const u = DateTime.fromISO(date, { zone: 'UTC' });
  let l;
  if (!timezone) {
    l = u.toLocal();
  } else {
    l = u.setZone(timezone);
  }
  return l.toFormat(format);
}

export default function formatMessageTime(date) {
  return formatLocalTime(date, 'M d HH:mm:ss');
}
