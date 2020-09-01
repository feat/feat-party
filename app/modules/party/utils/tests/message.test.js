import { getMaxId, getMinId } from '../message';

describe('Party - message utils', () => {
  describe('getMaxId', () => {
    it('handle numbers only', () => {
      const lists = [
        1,
        2,
        4,
        5,
        // { _id: 'temp' },
      ];
      const maxId = getMaxId(lists);
      expect(maxId).toEqual(5);
    });
    it('handle temp message mixed', () => {
      const lists = [1, 2, 4, { _id: 'another' }, 5, { _id: 'temp' }];
      const maxId = getMaxId(lists);
      expect(maxId).toEqual(5);
    });
  });

  describe('getMinId', () => {
    it('handle numbers only', () => {
      const lists = [
        1,
        2,
        4,
        5,
        // { _id: 'temp' },
      ];
      const maxId = getMinId(lists);
      expect(maxId).toEqual(1);
    });
    it('handle temp message mixed', () => {
      const lists = [1, 2, 4, { _id: 'another' }, 5, { _id: 'temp' }];
      const maxId = getMinId(lists);
      expect(maxId).toEqual(1);
    });
  });
});
