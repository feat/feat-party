import userReducer from '../reducers/user';

import {
  fetchUserAddresses,
  fetchUserPaymentSettings,
  getCurrentLocation,
  setGeoLocation,
  postUserAddress,
  deleteUserAddress,
  fetchUserExpertises,
} from '../actions/user';


describe('Exc -- User Info', () => {
  describe('fetch user addresses', () => {
    let state;
    it('request', () => {
      const action = fetchUserAddresses.request();
      state = userReducer(state, action);
      expect(state.isFetchingUserAddresses).toBe(true);
    });
    it('success', () => {
      const addresses = [{ id: 1 }, { id: 2 }];
      const action = fetchUserAddresses.success(addresses);
      state = userReducer(state, action);
      expect(state.addresses).toBe(addresses);
    });
    it('fulfill', () => {
      const action = fetchUserAddresses.fulfill();
      state = userReducer(state, action);
      expect(state.isFetchingUserAddresses).toBe(false);
      expect(state.userAddressesFetched).toBe(true);
    });
  });

  describe('post user address (new)', () => {
    // let state;
    const initAction = fetchUserAddresses.success([]);
    const state = userReducer(undefined, initAction);
    it('success', () => {
      const address = { id: 3 };
      const action = postUserAddress.success(address);
      const successState = userReducer(state, action);
      expect(successState.addresses).toContainEqual(address);
      expect(successState.postedAddress).toBe(address);
    });
    it('geocoding failure', () => {
      const error = new Error('GEOCODING_FAILED');
      const bounds = { left: 1, right: 2 };
      error.data = bounds;
      const action = postUserAddress.failure(error);
      const failureState = userReducer(state, action);
      expect(failureState.shouldDisplayPinPanel).toBe(true);
      expect(failureState.initialBounds).toBe(bounds);
    });
  });

  describe('get currrent location info', () => {
    let state;
    it('request', () => {
      const action = getCurrentLocation.request();
      state = userReducer(state, action);
      expect(state.isGettingCurrentLocation).toBe(true);
    });

    it('set geo location', () => {
      const geoInfo = {};
      const action = setGeoLocation(geoInfo);
      state = userReducer(state, action);
      expect(state.geoLocation).toBe(geoInfo);
    });

    it('success', () => {
      const address = {};
      const action = getCurrentLocation.success(address);
      state = userReducer(state, action);
      expect(state.currentLocation).toBe(address);
    });

    it('fulfill', () => {
      const action = getCurrentLocation.fulfill();
      state = userReducer(state, action);
      expect(state.isGettingCurrentLocation).toBe(false);
    });
  });

  describe('delete user address', () => {
    let state = {
      addresses: [{ id: 1 }, { id: 2 }],
      deletingAddress: {},
    };
    it('request', () => {
      const action = deleteUserAddress.request({ addressId: 2 });
      state = userReducer(state, action);
      expect(state.deletingAddress[2]).toBe(true);
    });
    it('success', () => {
      const action = deleteUserAddress.success({ addressId: 2 });
      state = userReducer(state, action);
      expect(state.addresses).toEqual([{ id: 1 }]);
    });
    it('fulfill', () => {
      const action = deleteUserAddress.fulfill({ addressId: 2 });
      state = userReducer(state, action);
      expect(state.deletingAddress[2]).toBe(false);
    });
  });

  describe('fetch user pay method info', () => {
    let state;
    it('request', () => {
      const action = fetchUserPaymentSettings.request();
      state = userReducer(state, action);
      expect(state.isFetchingUserPaymentSettings).toBe(true);
    });
    it('success', () => {
      const data = { defaultMethod: 123123 };
      const action = fetchUserPaymentSettings.success(data);
      state = userReducer(state, action);
      expect(state.paymentSettings).toBe(data);
    });
    it('fulfill', () => {
      const action = fetchUserPaymentSettings.fulfill();
      state = userReducer(state, action);
      expect(state.isFetchingUserPaymentSettings).toBe(false);
    });
  });

  describe('fetch user expertises', () => {
    let state;
    it('request', () => {
      const action = fetchUserExpertises.request();
      state = userReducer(state, action);
      expect(state.isFetchingUserExpertises).toBe(true);
    });
    it('success', () => {
      const list = [1, 2, 3];
      const action = fetchUserExpertises.success({
        list,
      });
      state = userReducer(state, action);
      expect(state.expertises).toEqual(list);
    });
    it('fulfill', () => {
      const action = fetchUserExpertises.fulfill();
      state = userReducer(state, action);
      expect(state.isFetchingUserExpertises).toBe(false);
    });
  });
});
