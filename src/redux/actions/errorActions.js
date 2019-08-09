import {DRAW_FORM_ERROR, RCV_FORM_ERROR} from '../types';

export const setDrawFormError = msg => 
    ({type: DRAW_FORM_ERROR, payload: msg});

export const setRcvFormError = msg => 
    ({type: RCV_FORM_ERROR, payload: msg});

export const setError = ({source, msg}) => {
    switch(source) {
        case "drawForm":
            return {type: DRAW_FORM_ERROR, payload: msg};
        case "rcvForm":
                return {type: RCV_FORM_ERROR, payload: msg};
        default:
            return {};
    };
};