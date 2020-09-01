import moment from 'moment';
import {
  mergeRecords,
  periodIsContinue,
  periodMerge,
  periodsIsEqual,
  openScheduleMerge,
} from '../utils'

describe('OpenTime utils test', () => {
  describe('periodsIsContinue, checking HH:mm', () => {
    it('periods are in same day', () => {
      const a = {
        start: moment('2019-12-05T00:00:00Z'),
        until: moment('2019-12-05T00:05:00Z'),
      };
      const b = {
        start: moment('2019-12-05T00:05:00Z'),
        until: moment('2019-12-05T00:10:00Z'),
      }
      expect(periodIsContinue(a, b)).toBe(true);
    });
    it('periods are in different day', () => {
      const a = {
        start: moment('2019-12-05T00:00:00Z'),
        until: moment('2019-12-05T00:05:00Z'),
      };
      const b = {
        start: moment('2019-12-10T00:05:00Z'),
        until: moment('2019-12-10T00:10:00Z'),
      }
      expect(periodIsContinue(a, b)).toBe(true);   
    });
    // TODO: timezone info
  })
  describe('periodsIsEqual', () => {
    it('periods are in the same day', () => {
      const a = {
        periods: [
          {
            start: moment('2019-12-05T00:00:00Z'),
            until: moment('2019-12-05T00:05:00Z'),
          },
          {
            start: moment('2019-12-06T00:05:00Z'),
            until: moment('2019-12-06T00:07:00Z'),
          },
          {
            start: moment('2019-12-05T00:13:00Z'),
            until: moment('2019-12-05T00:15:00Z'),
          },
        ],
      }
      const b = {
        periods: [
          {
            start: moment('2019-12-05T00:00:00Z'),
            until: moment('2019-12-05T00:05:00Z'),
          },
          {
            start: moment('2019-12-06T00:05:00Z'),
            until: moment('2019-12-06T00:07:00Z'),
          },
          {
            start: moment('2019-12-05T00:13:00Z'),
            until: moment('2019-12-05T00:15:00Z'),
          },
        ],
      }
      expect(periodsIsEqual(a, b)).toBe(true);
    })
    it('periods are not in the same day', () => {
      const a = {
        periods: [
          {
            start: moment('2019-12-05T00:00:00Z'),
            until: moment('2019-12-05T00:05:00Z'),
          },
          {
            start: moment('2019-12-06T00:05:00Z'),
            until: moment('2019-12-06T00:07:00Z'),
          },
          {
            start: moment('2019-12-05T00:13:00Z'),
            until: moment('2019-12-05T00:15:00Z'),
          },
        ],
      }
      const b = {
        periods: [
          {
            start: moment('2019-12-05T00:00:00Z'),
            until: moment('2019-12-05T00:05:00Z'),
          },
          {
            start: moment('2019-12-06T00:05:00Z'),
            until: moment('2019-12-06T00:07:00Z'),
          },
          {
            start: moment('2019-12-20T00:13:00Z'),
            until: moment('2019-12-20T00:15:00Z'),
          },
        ],
      }
      expect(periodsIsEqual(a, b)).toBe(true);
    })
  })

  describe('periodMerge', () => {
    it('periods are in the same day', () => {
      const a = {
        start: moment('2019-12-05T00:00:00Z'),
        until: moment('2019-12-05T00:05:00Z'),
      };
      const b = {
        start: moment('2019-12-05T00:05:00Z'),
        until: moment('2019-12-05T00:10:00Z'),
      }
      const merged = periodMerge(a, b);
      expect(merged.start.isSame('2019-12-05T00:00:00Z')).toBe(true);
      expect(merged.until.isSame('2019-12-05T00:10:00Z')).toBe(true);
    })
    it('periods are in different day', () => {
      const a = {
        start: moment('2019-12-05T00:00:00Z'),
        until: moment('2019-12-05T00:05:00Z'),
      };
      const b = {
        start: moment('2019-12-10T00:05:00Z'),
        until: moment('2019-12-10T00:10:00Z'),
      }
      const merged = periodMerge(a, b);
      expect(merged.start.isSame('2019-12-05T00:00:00Z')).toBe(true);
      expect(merged.until.isSame('2019-12-05T00:10:00Z')).toBe(true);
    });
  })
  
  describe('openScheduleMerge', () => {
    it('unique weekdays', () => {
      const a = {
        weekdays: [0, 1,2],
        periods: [],
      };
      const b = {
        weekdays: [3, 4],
        periods: [],
      }
      const merged = openScheduleMerge(a, b);
      expect(merged).toEqual({
        weekdays: [0, 1, 2, 3, 4],
        periods: [],
      })
    })
    it ('has duplicated weekdays', () => {
      const a = {
        weekdays: [0, 1,2],
        periods: [],
      };
      const b = {
        weekdays: [2, 3, 4],
        periods: [],
      }
      const merged = openScheduleMerge(a, b);
      expect(merged).toEqual({
        weekdays: [0, 1, 2, 3, 4],
        periods: [],
      })
    })
  })

  describe('mergeRecords', () => {
    it('has shouldMerge record', () => {
      const records = [
        { x: 1, y: 2 },
        { x: 1, y: 4 },
      ];
      const shouldMerge = (a, b) => a.x === b.x;
      const recordMerge = (a, b) => ({ x: a.x, y: b.y });
      const merged = mergeRecords(records, undefined, recordMerge, shouldMerge);
      expect(merged).toEqual([
        { x: 1, y: 4 },
      ])
    })
  })
  it('has no shouldMerge record', () => {
    const records = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
    ];
    const shouldMerge = (a, b) => a.x === b.x;
    const recordMerge = (a, b) => ({ x: a.x, y: b.y });
    const merged = mergeRecords(records, undefined, recordMerge, shouldMerge);
    expect(merged).toEqual([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
    ])
  })

  // TODO: check sorted
})