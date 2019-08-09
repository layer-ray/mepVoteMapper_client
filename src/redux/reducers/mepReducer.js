import {fetchSortedMeps, 
        fetchGroups, SET_MEP, 
        POPUP_ERROR} from '../types';

// all meps
export const sortedMepsReducer = (state={curr: [], loading: false}, action) => {
    switch(action.type) {
        case fetchSortedMeps.SUCCESS:
            return {curr: action.payload, loading: false};
        case fetchSortedMeps.LOADING:
            return {...state, loading: true};
        case POPUP_ERROR: 
            return {...state, loading: false};
        default: 
            return state;
    };
};

// selected mep
export const currentMepReducer = (state={}, action) => {
    switch(action.type) {
        case SET_MEP:
            return action.payload;
        default: 
            return state;
    };
};

// parties
export const groupsReducer = (state={curr: [], loading: false}, action) => {
    switch(action.type) {
        case fetchGroups.SUCCESS:
            return {curr: action.payload, loading: false};
        case fetchGroups.LOADING:
            return {...state, loading: true};
        case POPUP_ERROR:
            return {...state, loading: false};
        default:
            return state;
    };
};