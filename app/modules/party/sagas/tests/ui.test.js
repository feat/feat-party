// import { take, select } from 'redux-saga/effects';
import { changeRoomFlow } from '../uiSaga';
import { changeRoom } from '../../actions';

describe('Party - UI - flow', () => {
  describe('change room flow', () => {
    const gen = changeRoomFlow(
      changeRoom({
        roomId: 'user_1',
        contact: {
          friend: 1,
        },
      }),
    );
    it('should select room info', () => {
      expect(gen.next().value.type).toEqual('SELECT');
    });
  });
});
