import { createRoutine } from 'redux-saga-routines';

import { fetchTerm as fetchTermRequest } from './requests';

const NS = 'TERMS';

export const fetchTerm = createRoutine(`${NS}/FETCH_TERM`);

export const asyncFetchTerm = (payload) => async (dispatch) => {
  const { slug } = payload
  try {
    const { data } = await fetchTermRequest(slug)
    dispatch(
      fetchTerm.success({
        slug,
        data,
      }),
    );
  } catch (err) {
    dispatch(
      fetchTerm.failure({
        slug,
        data: err,
      }),
    );
    throw err;
  } finally {
    dispatch(fetchTerm.fulfill({ slug }));
  }
}