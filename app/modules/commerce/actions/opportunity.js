import { createRoutine } from 'redux-saga-routines';
import notification from '@feat/feat-ui/lib/notification';

import {
  createDemandBids as postBidRequest,
  ignoreDemand as ignoreDemandRequest,
  abandonDemand as abandonDemandRequest,
} from '@/client/service';

import { serviceDemand as serviceDemandSchema } from '@/schema';
import { serviceSocket } from '../socket';

const NS = `EXC/OPPORTUNITY`;

export const postBid = createRoutine(`${NS}/POST_BID`);
export const ignoreDemand = createRoutine(`${NS}/IGNORE_DEMAND`);
export const abandonDemand = createRoutine(`${NS}/ABANDON_DEMAND`);

export const fetchBiddingInfo = createRoutine(`${NS}/FETCH_BIDDING_INFO`);

export const joinChannel = (payload) => () => {
  serviceSocket.private(`service-opportunity-${payload}`);
}

export const asyncPostBid = (payload) => async (dispatch) => {
  try {
    dispatch(postBid.request({
      demandId: payload.demandId,
    }))
    const { data } = await postBidRequest(payload.demandId, {
      expertise: payload.expertise,
      value: payload.price,
    });
    dispatch(
      postBid.success({
        demandId: payload.demandId,
        entityMutators: [
          {
            [serviceDemandSchema.key]: {
              [payload.demandId]: {
                last_bid: {
                  $set: data.value,
                },
              },
            },
          },
        ],
      }),
    );
    // join room
    // yield put(joinChannel(payload.demandId));
  } catch (err) {
    dispatch(
      postBid.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: err.message,
    });
    throw err;
  } finally {
    dispatch(postBid.fulfill(payload));
  }
}

export const asyncIgnoreDemand = (payload) => async (dispatch) => {
  try {
    dispatch(ignoreDemand.request({
      demandId: payload.demandId,
    }));
    await ignoreDemandRequest(payload.demandId);
    dispatch(
      ignoreDemand.success({
        demandId: payload.demandId,
        entityMutators: [
          {
            [serviceDemandSchema.key]: {
              [payload.demandId]: {
                hasIgnored: {
                  $set: true,
                },
              },
            },
          },
        ],
      }),
    );
    serviceSocket.leave(`service-opportunity-${payload.demandId}`);
  } catch (err) {
    dispatch(
      ignoreDemand.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
    notification.error({
      title: 'Error',
      description: err.message,
    });
    throw err;
  } finally {
    dispatch(
      ignoreDemand.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
}

export const asyncAbandonDemand  = (payload) => async (dispatch) => {
  try {
    dispatch(abandonDemand.request({
      demandId: payload.demandId,
    }));
    await abandonDemandRequest(payload.demandId);
    dispatch(
      abandonDemand.success({
        demandId: payload.demandId,
        entityMutators: [
          {
            [serviceDemandSchema.key]: {
              [payload.demandId]: {
                hasAbandoned: {
                  $set: true,
                },
              },
            },
          },
        ],
      }),
    );
    serviceSocket.leave(`service-opportunity-${payload.demandId}`);
  } catch (err) {
    dispatch(
      abandonDemand.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
    notification.error({
      message: 'Error',
      description: err.message,
    });
    throw err;
  } finally {
    dispatch(
      abandonDemand.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
}