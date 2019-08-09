import {DRAW_FORM_ERROR, RCV_FORM_ERROR} from '../types';

export const errorReducer = (state = {}, action) => {
    switch(action.type) {
        case DRAW_FORM_ERROR:
            return {...state, drawForm: action.payload};
        case RCV_FORM_ERROR:
            return {...state, rcvForm: action.payload};
        default:
            return state;
    };
};