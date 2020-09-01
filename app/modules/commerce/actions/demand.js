import { createAction } from 'redux-actions';
import { createRoutine } from 'redux-saga-routines';
import { normalize } from 'normalizr';

import notification from '@feat/feat-ui/lib/notification';

import {
  fetchDemand as fetchDemandRequest,
  getDemandBids as getDemandBidsRequest,
  blackUser as blackUserRequest,
  updateDemandStatus as updateDemandStatusRequest,
  selectDemandWinner as selectDemandWinnerRequest,
} from '@/client/service';

import {
  serviceDemand as serviceDemandSchema,
  serviceOrder as serviceOrderSchema,
} from '@/schema';

import { serviceSocket } from '../socket';
import { initOrderPayment } from './payment';
import {
  DEMAND_STATUS_CLOSED,
  DEMAND_STATUS_PROVIDER_SELECTED,
} from '../constants';

const NS = `EXC/DEMAND`;

export const fetchDemand = createRoutine(`${NS}/FETCH_DEMAND`);
export const fetchBiddingInfo = createRoutine(`${NS}/FETCH_BIDDING_INFO`);
export const getDemandBids = createRoutine(`${NS}/FETCH_BIDS`);
export const closeDemand = createRoutine(`${NS}/ClOSE_DEMAND`);
export const cancelDemand = createRoutine(`${NS}/CANCEL_DEMAND`);
export const selectWinner = createRoutine(`${NS}/SELECT_WINNER`);
export const blackUser = createRoutine(`${NS}/BLACK_USER`);
export const newParticipant = createAction(`${NS}/NEW_PARTICIPANT`);
export const newBid = createAction(`${NS}/NEW_BID`);
export const newLeading = createAction(`${NS}/NEW_LEADING`);
export const demandStatusUpdated = createAction(`${NS}/STATUS_UPDATED`);
export const participantQuit = createAction(`${NS}/PARTICIPANT_QUIT`);

const getDemandChannel = (id) => `service-demand-${id}`;
export const joinChannel = (payload) => () => {
  serviceSocket.private(getDemandChannel(payload));
};

export const asyncFetchDemand = (payload) => async (dispatch) => {
  try {
    dispatch(
      fetchDemand.request({
        demandId: payload.demandId,
      }),
    );
    const { data } = await fetchDemandRequest(payload.demandId);
    const normalized = normalize(data, serviceDemandSchema);
    dispatch(
      fetchDemand.success({
        demandId: payload.demandId,
        fetchedAt: Date.now(),
        entities: normalized.entities,
      }),
    );
    if (payload.role === 'owner') {
      dispatch(
        getDemandBids({
          demandId: payload.demandId,
        }),
      );
    }
    return data;
  } catch (err) {
    dispatch(
      fetchDemand.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(
      fetchDemand.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};

export const asyncGetDemandBids = (payload) => async (dispatch) => {
  try {
    dispatch(
      getDemandBids.request({
        demandId: payload.demandId,
      }),
    );
    const { data } = await getDemandBidsRequest(payload.demandId);
    dispatch(
      getDemandBids.success({
        demandId: payload.demandId,
        entityMutators: [
          {
            [serviceDemandSchema.key]: {
              [payload.demandId]: {
                activeBids: {
                  $set: data,
                },
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    dispatch(
      getDemandBids.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      getDemandBids.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};

export const asyncBlackUser = (payload) => async (dispatch) => {
  try {
    // TODO
    await blackUserRequest(payload.demandId, payload.data);
  } catch (err) {
    dispatch(
      blackUser.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      blackUser.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};

export const asyncSelectWinner = (payload) => async (dispatch) => {
  try {
    // Close Demand Before Select Winner.
    if (payload.demandStatus !== DEMAND_STATUS_CLOSED) {
      const { data: closed } = await updateDemandStatusRequest(
        payload.demandId,
        {
          action: 'close',
        },
      );
      const normalized = normalize(closed, serviceDemandSchema);
      dispatch(
        closeDemand.success({
          demandId: payload.demandId,
          entities: normalized.entities,
        }),
      );
    }
    const { data: demandOrder } = await selectDemandWinnerRequest(
      payload.demandId,
      {
        user: payload.data.user.uid,
      },
    );
    const normalized = normalize(demandOrder, serviceOrderSchema);
    dispatch(
      selectWinner.success({
        demandId: payload.demandId,
        entities: normalized.entities,
        entityMutators: [
          {
            [serviceDemandSchema.key]: {
              [payload.demandId]: (demand) => ({
                ...demand,
                order: normalized.result,
                status: DEMAND_STATUS_PROVIDER_SELECTED,
                winner: payload.data.user,
              }),
            },
          },
        ],
      }),
    );
    dispatch(
      initOrderPayment({
        orderId: demandOrder.id,
        data: demandOrder,
        trigger: 'demand',
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    dispatch(
      selectWinner.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      selectWinner.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};

export const asyncCloseDemand = (payload) => async (dispatch) => {
  try {
    const { data } = await updateDemandStatusRequest(payload.demandId, {
      action: 'close',
    });
    const normalized = normalize(data, serviceDemandSchema);
    dispatch(
      closeDemand.success({
        demandId: payload.demandId,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      closeDemand.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      closeDemand.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};

export const asyncCancelDemand = (payload) => async (dispatch) => {
  try {
    const { data } = await updateDemandStatusRequest(payload.demandId, {
      action: 'cancel',
    });
    const normalized = normalize(data, serviceDemandSchema);
    dispatch(
      cancelDemand.success({
        demandId: payload.demandId,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    dispatch(
      cancelDemand.failure({
        demandId: payload.demandId,
        data: err,
      }),
    );
  } finally {
    dispatch(
      cancelDemand.fulfill({
        demandId: payload.demandId,
      }),
    );
  }
};
