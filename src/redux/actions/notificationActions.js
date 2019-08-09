import {SET_NOTIFICATION, CLEAN_NOTIFICATION} from '../types';

export const setNotification = (notState) => ({
    type: SET_NOTIFICATION, payload: notState
});

export const cleanUpNotification = () => ({type: CLEAN_NOTIFICATION});