import moment from 'moment';

export function mergeRecords(sorted, prepend = [], recordMerge, shouldMerge) {
  if (sorted.length === 1) {
    prepend.push(sorted[0]);
    return prepend;
  }
  if (sorted.length === 0) {
    return prepend;
  }
  const first = sorted.shift();
  const second = sorted.shift();
  if (shouldMerge(first, second)) {
    sorted.unshift(recordMerge(first, second));
    return mergeRecords(sorted, prepend, recordMerge, shouldMerge);
  } 
  sorted.unshift(second);
  prepend.push(first);
  return mergeRecords(sorted, prepend, recordMerge, shouldMerge);
}

export function periodIsContinue (a, b) {
  return a.until.format('HH:mm') === b.start.format('HH:mm')
}
  
export function periodMerge(a, b) {
  return {
    start: a.start,
    until: moment(a.start).hour(b.until.hour()).minute(b.until.minute()),
  }
}


export function encodePeriods(records) {
  const compos = records.map((record) => `${record.start.format('HHmm')}${record.until.format('HHmm')}`)
  return `${records.length}${compos.join('')}`
}

export function periodsIsEqual(a, b) {
  return encodePeriods(a.periods) === encodePeriods(b.periods);
}

export function openScheduleMerge(a, b) {
  return {
    weekdays: [...new Set([...a.weekdays, ...b.weekdays])],
    periods: a.periods,
  }
}
