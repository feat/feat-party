import { createRoutine } from 'redux-saga-routines'
import { createAction } from 'redux-actions'

import {
  fetchWechatInfo as fetchWechatInfoRequest,
  fetchWechatUnbindingInfo as fetchWechatUnbindingInfoRequest,
} from '@/client/user'


const NS = 'SETTINGS';

export const fetchWechatInfo = createRoutine(`${NS}/FETCH_WECHAT_INFO`);
export const fetchUnbindWechatInfo = createRoutine(`${NS}/FETCH_WECHAT_UNBIND`);
export const showUnbindingQrCode = createAction(`${NS}/WECHAT_BINDING/SHOW_UNBIND_QRCODE`);
export const hideUnbindingQrCode = createAction(`${NS}/WECHAT_BINDING/HIDE_UNBIND_QRCODE`)

export const asyncFetchWechatInfo = () => async (dispatch) => {
  dispatch(fetchWechatInfo.trigger());
  try {
    dispatch(fetchWechatInfo.request());
    const { data } = await fetchWechatInfoRequest();
    dispatch(fetchWechatInfo.success(data));
  } catch (err) {
    dispatch(fetchWechatInfo.failure(err));
    if (err.code !== 'WX_BIND_FIRST') {
      throw err;
    }
  } finally {
    dispatch(fetchWechatInfo.fulfill());
  }
}

export const asyncFetchUnbindWechatInfo = () => async (dispatch) => {
  dispatch(fetchUnbindWechatInfo.trigger());
  try {
    dispatch(fetchUnbindWechatInfo.request());
    const { data } = await fetchWechatUnbindingInfoRequest();
    dispatch(fetchUnbindWechatInfo.success(data));
  } catch (err) {
    dispatch(fetchUnbindWechatInfo.failure(err));
    throw err;
  } finally {
    dispatch(fetchUnbindWechatInfo.fulfill());
  }
}