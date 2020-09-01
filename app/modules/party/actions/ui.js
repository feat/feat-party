import { createAction } from 'redux-actions';

const NS = 'PARTY';

export const changeMode = createAction(`${NS}/CHANGE_MODE`);
export const changeTab = createAction(`${NS}/CHANGE_TAB`);
export const changeRoom = createAction(`${NS}/CHANGE_ROOM`);
export const showIM = createAction(`${NS}/SHOW_IM`);
export const hideIM = createAction(`${NS}/HIDE_IM`);
export const toggleIM = createAction(`${NS}/TOGGLE_IM_DISPLAY`);
export const contactTab = createAction(`${NS}/CONTACT_TAB`);
