import {fetchVotation, fetchVotations, setVotations, POPUP_ERROR} from '../types';
// main list - list all the texts matching the search criteria
export const textListReducer = (state={curr:[], loading: false}, action) => {
    switch(action.type) {
        case fetchVotations.LOADING:
            return {...state, loading: true};
        case fetchVotations.SUCCESS:
            return {curr: action.payload, loading: false};
        case fetchVotations.FLUSH:
            return {curr: [], loading: false};
        case POPUP_ERROR:
            return {...state, loading: false};
        default:
            return state;
    }
};

// list all the votations of the selected text
export const currentVotationsReducer = (state=[], action) => {
    switch(action.type) {
        case setVotations.SET_CURRENT_VOTATIONS:
            return action.payload;
        case setVotations.FLUSH_CURRENT_VOTATIONS:
            return [];
        default:
            return state;
    };
};

// fetch and store the selected votation (each mep vote)
export const votationReducer = (state={curr:{}, loading: false}, action) => {
    switch(action.type) {
        case fetchVotation.LOADING:
            return {...state, loading: true};
        case fetchVotation.SUCCESS:
            return {curr: action.payload, loading: false};
        case POPUP_ERROR:
            return {...state, loading: false};
        default:
            return state;
    };
};