import { takeEvery, put, call, all, race, take } from 'redux-saga/effects';
import { normalize } from 'normalizr';

import {
  createServiceDemand as createServiceDemandRequest,
  addDemandImage,
  setServiceDemandTags as setServiceDemandTagsRequest,
  // updateServiceDemand as updateServiceDemandRequest,
  publishServiceDemand as publishServiceDemandRequest,
} from '@/client/commerce';

import { serviceDemand as serviceDemandSchema } from '@/schema';

import message from '@feat/feat-ui/lib/message';

import { postUserAddress } from '../actions/user';

import { confirmDemandCreation } from '../actions/demand-creation';

import { mapAddressInfo } from '../utils';

function* confirmDemandCreationFlow(action) {
  const { payload } = action;
  try {
    yield put(confirmDemandCreation.request());
    let demandAddress;
    if (
      payload.address &&
      ((payload.address.id && payload.address.is_update) || !payload.address.id)
    ) {
      yield put(postUserAddress(payload.address));

      const { success, failure } = yield race({
        success: take(postUserAddress.SUCCESS),
        failure: take(postUserAddress.FAILURE),
      });
      if (failure) {
        message.error(failure.payload.message);
        return;
      }
      demandAddress = success.payload;
    } else {
      demandAddress = payload.address;
    }
    const { data: demand } = yield call(createServiceDemandRequest, {
      title: payload.title,
      description: payload.description,
      category: payload.category ? payload.category.id : undefined,
      tags: payload.tags,
      service_address: mapAddressInfo(demandAddress),
      delivery_mode: payload.serviceType,
      service_length: 1,
      start_time: payload.dateRequired.format(),
      end_time: payload.dateRequired
        .clone()
        .add(1, 'hour')
        .format(),
      pre_closed_time: payload.closeDate
        ? payload.closeDate.format()
        : undefined,
    });

    if (payload.files) {
      yield all(payload.files.map((file) => addDemandImage(demand.id, file)));
    }

    if (payload.tags) {
      yield call(setServiceDemandTagsRequest, demand.id, {
        tags: payload.tags,
      });
    }

    const { data: published } = yield call(
      publishServiceDemandRequest,
      demand.id,
    );
    const normalized = normalize(published, serviceDemandSchema);
    yield put(
      confirmDemandCreation.success({
        demandId: normalized.result,
        demand: published,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    message.error(err.message);
    yield put(confirmDemandCreation.failure(err));
  } finally {
    yield put(confirmDemandCreation.fulfill());
  }
}

export default function* demandCreationService() {
  yield takeEvery(confirmDemandCreation, confirmDemandCreationFlow);
}
