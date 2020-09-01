import {
  takeEvery,
  select,
  put,
  call,
  fork,
  // delay
} from 'redux-saga/effects';
import { normalize } from 'normalizr';
import { expertise as expertiseSchema } from '@/schema';

import ApiError from '@/errors/ApiError';

import { getGeoLocation } from '@/utils/geo';

import {
  fetchUserAddresses as fetchUserAddressesRequest,
  postUserAddress as postUserAddressRequest,
  deleteUserAddress as deleteUserAddressRequest,
  setDefaultAddress as setDefaultAddressRequest,
  getExpertises as getExpertisesRequest,
} from '@/client/user';

import { fetchUserPaymentSettings as fetchUserPaymentSettingsRequest } from '@/client/commerce';

import notification from '@feat/feat-ui/lib/notification';

import {
  reverseGeocode as reverseGeocodeRequest,
  fetchGeocode as fetchGeocodeRequest,
} from '@/client/geo';

import {
  fetchUserAddresses,
  postUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  getCurrentLocation,
  setGeoLocation,
  fetchGeocode,
  userInfoForBidding,
  fetchUserPaymentSettings,
  fetchUserExpertises,
} from '../actions/user';

import { selectUserCommerceInfo } from '../selectors';
import { initOrderCreation } from '../actions/creation';
import { initOrderPayment } from '../actions/payment';
import { initDemandCreation } from '../actions/demand-creation';
import { SERVICE_TYPE_ON_SITE } from '../constants';
import { fetchOpportunities } from '../actions/opportunity-dash';

const ADDRESS_TYPE_WORKPLACE = 100;

function* fetchUserExpertisesAsync() {
  const userState = yield select((state) => selectUserCommerceInfo(state));
  if (userState.isFetchingUserExpertises) {
    return;
  }
  try {
    yield put(fetchUserExpertises.request());
    // const addresses = demoAddresses;
    const { data } = yield call(getExpertisesRequest);
    const normalized = normalize(data, [expertiseSchema]);
    yield put(
      fetchUserExpertises.success({
        list: normalized.result,
        entities: normalized.entities,
      }),
    );
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      fetchUserExpertises.failure({
        data: err,
      }),
    );
  } finally {
    yield put(fetchUserExpertises.fulfill());
  }
}

function* fetchUserAddressesAsync() {
  const userState = yield select((state) => selectUserCommerceInfo(state));
  if (userState.isFetchingUserAddresses) {
    return;
  }
  try {
    yield put(fetchUserAddresses.request());
    // const addresses = demoAddresses;
    const { data: addresses } = yield call(fetchUserAddressesRequest);
    addresses.sort((a, b) => {
      if (a.is_default) {
        return -1;
      }
      if (a.address_type === ADDRESS_TYPE_WORKPLACE  && b.is_default) {
        return 1;
      } 
      if (a.address_type === ADDRESS_TYPE_WORKPLACE) {
        return -1;
      }
      return 0;
    })
    yield put(fetchUserAddresses.success(addresses));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      fetchUserAddresses.failure({
        data: err,
      }),
    );
  } finally {
    yield put(fetchUserAddresses.fulfill());
  }
}

function* postUserAddressAsync(action) {
  const { payload } = action;
  const data = { ...payload };
  // TODO: update user address.
  data.level_1 = data.level_1 || '中国';
  data.country_code = data.country_code || 'CHN';
  if (data.geo) {
    data.lat = data.geo.lat;
    data.lng = data.geo.lng;
    delete data.geo;
    delete data.auto_geo;
  } else if (data.auto_geo) {
    data.lat = data.auto_geo.lat;
    data.lng = data.auto_geo.lng;
    delete data.auto_geo;
  }

  try {
    yield put(postUserAddress.request());
    const { data: address } = yield call(postUserAddressRequest, data);
    // yield delay(1000);
    // const address = { id: 'test' };

    yield put(postUserAddress.success(address));
  } catch (err) {
    if (err.code === 'GEOCODING_FAILED') {
      yield put(postUserAddress.failure(err));
    } else if (err.code === 'VALIDATION_EXCEPTION') {
      yield put(postUserAddress.failure(err));
    } else {
      yield put(postUserAddress.failure(err));
    }
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
  } finally {
    yield put(postUserAddress.fulfill(payload));
  }
}

function* deleteUserAddressAsync(action) {
  const { payload } = action;
  try {
    yield put(deleteUserAddress.request(payload));
    yield call(deleteUserAddressRequest, payload.addressId);
    yield put(deleteUserAddress.success(payload));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      deleteUserAddress.failure({
        addressId: payload.addressId,
        data: err,
      }),
    );
  } finally {
    yield put(deleteUserAddress.fulfill(payload));
  }
}


function* setDefaultAddressAsync(action) {
  const { payload } = action;
  try {
    yield put(setDefaultAddress.request(payload));
    const { data } = yield call(setDefaultAddressRequest, payload.addressId);
    yield put(setDefaultAddress.success(data));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(
      setDefaultAddress.failure({
        addressId: payload.addressId,
        data: err,
      }),
    );
  } finally {
    yield put(setDefaultAddress.fulfill(payload));
  }
}

function* getCurrentLocationAsync() {
  const userState = yield select((state) => selectUserCommerceInfo(state));
  if (userState.isGettingCurrentUserInfo) {
    return;
  }
  try {
    yield put(getCurrentLocation.request());
    // yield delay(1000);
    // // throw new Error();
    // yield put(
    //   setGeoLocation({
    //     coords: {
    //       latitude: 39.991856,
    //       longitude: 116.306606,
    //     },
    //   }),
    // );
    // yield delay(500);
    // const address = demoAddress;
    const data = yield call(getGeoLocation);
    yield put(setGeoLocation(data));

    const { data: address } = yield call(reverseGeocodeRequest, {
      lat: data.coords.latitude,
      lng: data.coords.longitude,
      with_user_info: true,
    });
    yield put(getCurrentLocation.success(address));
  } catch (err) {
    logging.error(err);
    yield put(getCurrentLocation.failure(err));
  } finally {
    yield put(getCurrentLocation.fulfill());
  }
}

function* fetchGeocodeAsync(action) {
  const { payload } = action;
  try {
    const {
      data: { point, bounds },
    } = yield call(fetchGeocodeRequest, payload);
    yield put(
      fetchGeocode.success({
        params: payload,
        data: {
          point,
          bounds: {
            north: bounds.northeast.lat,
            east: bounds.northeast.lng,
            south: bounds.southwest.lat,
            west: bounds.southwest.lng,
          },
        },
      }),
    );
  } catch (err) {
    logging.error(err);
    yield put(
      fetchGeocode.failure({
        params: payload,
        data: err,
      }),
    );
  } finally {
    yield put(fetchGeocode.fulfill(payload));
  }
}

function* fetchUserPaymentSettingsAsync() {
  try {
    yield put(fetchUserPaymentSettings.request());
    const { data } = yield call(fetchUserPaymentSettingsRequest);
    yield put(fetchUserPaymentSettings.success(data));
  } catch (err) {
    notification.error({
      message: 'Error',
      description: err.message,
    });
    if (!(err instanceof ApiError)) {
      logging.error(err);
    }
    yield put(fetchUserPaymentSettings.failure(err));
  } finally {
    yield put(fetchUserPaymentSettings.fulfill());
  }
}

function* tryToFetchUserCommerceInfo(action) {
  const {
    payload: { serviceType },
  } = action;

  const userCommerceInfo = yield select((state) =>
    selectUserCommerceInfo(state),
  );

  yield fork(tryToFetchUserPaymentInfo);

  if (serviceType === SERVICE_TYPE_ON_SITE && !userCommerceInfo.addresses) {
    yield fork(fetchUserAddressesAsync, fetchUserAddresses.trigger());
    yield fork(getCurrentLocationAsync);
  }

  // TODO: payment config
}

function* tryToFetchUserPaymentInfo() {
  const userCommerceInfo = yield select((state) =>
    selectUserCommerceInfo(state),
  );
  if (
    !userCommerceInfo.paymentSettings &&
    !userCommerceInfo.isFetchingUserPaymentSettings
  ) {
    yield fork(fetchUserPaymentSettingsAsync, fetchUserPaymentSettings);
  }
}

function* initDemandCreationFlow() {
  const userCommerceInfo = yield select((state) =>
    selectUserCommerceInfo(state),
  );

  if (!userCommerceInfo.addresses) {
    yield fork(fetchUserAddressesAsync, fetchUserAddresses.trigger());
    yield fork(getCurrentLocationAsync);
  }
}

function* fetchUserBiddingInfo() {
  const userCommerceInfo = yield select((state) =>
    selectUserCommerceInfo(state),
  );
  // fetch addresses
  if (!userCommerceInfo.addresses) {
    yield fork(fetchUserAddressesAsync, fetchUserAddresses.trigger());
  }

  // fetch expertises
  if (!userCommerceInfo.expertises) {
    yield fork(fetchUserExpertisesAsync);
  }
}

export default function* userService() {
  yield takeEvery(fetchUserAddresses, fetchUserAddressesAsync);
  yield takeEvery(postUserAddress, postUserAddressAsync);
  yield takeEvery(deleteUserAddress, deleteUserAddressAsync);
  yield takeEvery(setDefaultAddress, setDefaultAddressAsync);

  yield takeEvery(initOrderCreation, tryToFetchUserCommerceInfo);
  yield takeEvery(initOrderPayment, tryToFetchUserPaymentInfo);
  yield takeEvery(initDemandCreation, initDemandCreationFlow);
  // address form
  yield takeEvery(fetchGeocode, fetchGeocodeAsync);
  yield takeEvery(fetchOpportunities, fetchUserBiddingInfo);
  yield takeEvery(userInfoForBidding, fetchUserBiddingInfo);
}
