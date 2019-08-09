import {SET_NOTIFICATION, CLEAN_NOTIFICATION} from '../types';

export const notificationReducer = (state={type: "", msg: ""}, action) => {
    switch(action.type) {
        case SET_NOTIFICATION:
            return action.payload;
        case CLEAN_NOTIFICATION:
            return {type: "", msg: ""};
        default:
            return state;
    };
};