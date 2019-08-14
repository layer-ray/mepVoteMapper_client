import {fetchGroups, SET_NOTIFICATION} from '../types';

export const groupReducer = (state  = {curr: [], loading: false}, action) => {
    switch(action.type) {
        case fetchGroups.LOADING:
            return {...state, loading: true};
        case fetchGroups.SUCCESS:
            return {curr: action.payload, loading: false};
        case SET_NOTIFICATION:
            return {...state, loading: false};
        default: 
            return state;
    };
};