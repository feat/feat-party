import { fork, call, spawn, takeEvery, select } from 'redux-saga/effects';

import { selectCurrentUser } from '@/modules/auth/selectors';

import { initUserService } from './modules/auth/actions';
import languageService from './modules/language/saga';

import commentService from './modules/comment/saga';
import likeService from './modules/like/saga';

function* loadUserIndependentServices() {
  yield fork(commentService);
  yield fork(likeService);
  // yield fork(loadAdvertiseService);
  yield fork(languageService);
}

function* loadPartyService() {
  const partySaga = yield import('./modules/party/sagas');
  yield fork(partySaga.default);
}

// function* loadAdvertiseService() {
//   const asSaga = yield import('./routes/advertiser/saga');
//   yield fork(asSaga.default);
// }

function* loadUserServices() {
  yield fork(loadPartyService);
}

function* initUserDependentService(init = false) {
  const currentUser = yield select(selectCurrentUser);
  if (currentUser && currentUser.uid) {
    yield fork(loadUserServices, currentUser);
  } else if (init) {
    yield spawn(watchInitUserService);
  }
}

function* watchInitUserService() {
  yield takeEvery(initUserService, initUserDependentService);
}

export default function* appSaga() {
  yield fork(loadUserIndependentServices);
  yield call(initUserDependentService, true);
}
