import { handleActions } from 'redux-actions';
import { fetchWechatInfo, fetchUnbindWechatInfo, showUnbindingQrCode, hideUnbindingQrCode } from '../actions/wechatBinding';

export const initialState = {
  onceFetched: false,
  data: null,
  bindingInfo: null,
  unbindingInfo: null,
  fetchError: null,
  fetchUnbindingError: null,
  loading: false,
  showUnbindingQrCode: false,
}

export default handleActions({
  [fetchWechatInfo.TRIGGER]: (state) => ({
    ...state,
    onceFetched: true,
    data: null,
    fetchError: null,
  }),
  [fetchWechatInfo.REQUEST]: (state) => ({
    ...state,
    loading: true,
  }),
  [fetchWechatInfo.SUCCESS]: (state, action) => ({
    ...state,
    user: action.payload,
  }),
  [fetchWechatInfo.FAILURE]: (state, action) => {
    if (action.payload.code === 'WX_BIND_FIRST') {
      return {
        ...state,
        bindingInfo: action.payload.data,
      }
    }
    return {
      ...state,
      fetchError: action.payload,
    }
  },
  [fetchWechatInfo.FULFILL]: (state) => ({
    ...state,
    loading: false,
  }),
  [fetchUnbindWechatInfo.TRIGGER]: (state) => ({
    ...state,
    fetchUnbindingError: null,
  }),
  [fetchUnbindWechatInfo.REQUEST]: (state) => ({
    ...state,
    fetchingUnbinding: true,
  }),
  [fetchUnbindWechatInfo.SUCCESS]: (state, action) => ({
    ...state,
    unbindingInfo: action.payload,
  }),
  [fetchUnbindWechatInfo.FAILURE]: (state, action) => ({
    ...state,
    fetchUnbindingError: action.payload,
  }),
  [fetchUnbindWechatInfo.FULFILL]: (state) => ({
    ...state,
    fetchingUnbinding: false,
  }),

  [showUnbindingQrCode]: (state) => ({
    ...state,
    showUnbindingQrCode: true,
  }),
  [hideUnbindingQrCode]: (state) => ({
    ...state,
    showUnbindingQrCode: false,
  }),
}, initialState)