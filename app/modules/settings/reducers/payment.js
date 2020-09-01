import { handleActions } from 'redux-actions';
import update from 'immutability-helper';
import { 
  fetchPaymentSettings,
  fetchPaymentAccounts,
  addPaymentAccount,
  deletePaymentAccount,
  setDefaultPaymentAccount,
  setDefaultReceiptAccount,
} from '../actions/payment';

export const initialState = {
  basic: null,
  accounts: null,
  onceFetched: false,
  fetchingSettings: false,
  fetchingAccounts: false,
  fetchSettingsError: null,
  fetchAccountsError: null,
}

export default handleActions({
  [fetchPaymentSettings.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    fetchSettingsError: null,
  }),
  [fetchPaymentSettings.REQUEST]: (state) => ({
    ...state,
    fetchingSettings: true,
  }),
  [fetchPaymentSettings.SUCCESS]: (state, action) => update(state, {
    basic: (info) => {
      if (info) {
        return {
          ...info,
          ...action.payload,
        }
      }
      return action.payload;
    },
  }),
  [fetchPaymentSettings.FAILURE]: (state, action) => ({
    ...state,
    fetchSettingsError: action.payload,
  }),
  [fetchPaymentSettings.FULFILL]: (state) => ({
    ...state,
    fetchingSettings: false,
  }),
  [fetchPaymentAccounts.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    fetchAccountsError: null,
  }),
  [fetchPaymentAccounts.REQUEST]: (state) => ({
    ...state,
    fetchingAccounts: true,
  }),
  [fetchPaymentAccounts.SUCCESS]: (state, action) => update(state, {
    accounts: { $set: action.payload.accounts },
    basic: (info) => {
      if (info) {
        return {
          ...info,
          default_payment: action.payload.default_payment,
          default_receipt: action.payload.default_receipt,
        }
      }
      return {
        default_payment: action.payload.default_payment,
        default_receipt: action.payload.default_receipt,
      }
    },
  }),
  [fetchPaymentAccounts.FAILURE]: (state, action) => ({
    ...state,
    fetchAccountsError: action.payload,
  }),
  [fetchPaymentAccounts.FULFILL]: (state) => ({
    ...state,
    fetchingAccounts: false,
  }),
  [addPaymentAccount.SUCCESS]: (state, action) =>
    update(state, {
      accounts: (list = []) => {
        const { payload } = action;
        let concated = [payload, ...list];
        // reset default_payment account
        if (payload.default_payment) {
          concated = concated.map((account) => {
            if (account.id === payload.id) {
              return payload;
            }
            if (account.default_payment) {
              return {
                ...account,
                default_payment: false,
              };
            }
            return account;
          });
        }
        // reset default_receipt account
        if (payload.default_receipt) {
          concated = concated.map((account) => {
            if (account.id === payload.id) {
              return payload;
            }
            if (account.default_receipt) {
              return {
                ...account,
                default_payment: false,
              };
            }
            return account;
          });
        }
        return concated;
      },
    }),

  [deletePaymentAccount.SUCCESS]: (state, action) =>
    update(state, {
      accounts: (list = []) =>
        list.filter((item) => item.id !== action.payload.id),
    }),

  [setDefaultPaymentAccount.SUCCESS]: (state, action) => {
    const { payload } = action;
    return update(state, {
      basic: {
        default_payment: {
          $set: payload.id,
        },
      },
      accounts: (list) =>
        list.map((account) => {
          if (account.id === payload.id) {
            return payload;
          }
          if (account.default_payment) {
            return {
              ...account,
              default_payment: false,
            };
          }
          return account;
        }),
    });
  },

  [setDefaultReceiptAccount.SUCCESS]: (state, action) => {
    const { payload } = action;
    return update(state, {
      basic: {
        default_receipt: {
          $set: payload.id,
        },
      },
      accounts: (list) =>
        list.map((account) => {
          if (account.id === payload.id) {
            return payload;
          }
          if (account.default_receipt) {
            return {
              ...account,
              default_receipt: false,
            };
          }
          return account;
        }),
    });
  },
}, initialState)