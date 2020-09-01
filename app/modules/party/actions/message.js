import { createRoutine } from 'redux-saga-routines';

// Message
// ------------------

const NS = 'PARTY';

export const sendMessage = createRoutine(`${NS}/SEND_MESSAGE`);
// export const broadcastMessage = createRoutine(`${NS}/SEND_BROADCAST_MESSAGE`);
