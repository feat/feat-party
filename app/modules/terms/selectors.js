import get from 'lodash/get';
import { REDUCER_KEY, initialState } from './reducer';

export const selectTerm = (state, { slug }) => get(state, [REDUCER_KEY, slug], initialState);
