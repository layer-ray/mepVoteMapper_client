import {fetchVotation, fetchVotations, 
        setVotations, SET_NOTIFICATION} from '../types';

export const fetchVotationAction = id => async dispatch => {
    dispatch({type: fetchVotation.LOADING});
    const reqUrl = 'https://mep-vote-mapper.herokuapp.com/rcv/get-by-id/' + encodeURIComponent(id);

    try {
        const votation = await fetch(reqUrl)
                            .then(res => res.json());
                
        votation.error
                ? dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:votation.error}})
                : dispatch({type: fetchVotation.SUCCESS, payload: votation.fetchResponse})
    } catch(error) {
        dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg: error}}) // stringified in component
    };
};

export const fetchVotationsByDates = dates => async dispatch => {

    dispatch({type: fetchVotations.LOADING});
    const reqUrl = 'https://mep-vote-mapper.herokuapp.com/rcv/get-by-dates';
    
    const reqOpts = {
        method: 'post',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({dates})
    };

    try {
        const rcvs = await fetch(reqUrl, reqOpts).then(res => res.json());
        rcvs.error
                ? dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:rcvs.error}})
                : dispatch({type: fetchVotations.SUCCESS, payload: rcvs.fetchResponse});
    } catch(error) {
        dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg: error}});
    };
};

export const fetchVotationsByTextTitle = lookupData => async dispatch => {
    dispatch({type: fetchVotations.LOADING});
    
    const reqUrl = 'https://mep-vote-mapper.herokuapp.com/text/get-text-by-title'
    const reqOpts = {
        method: 'post',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({words: lookupData})
    };
    
    try {
        const texts = await fetch(reqUrl, reqOpts)
        .then(res => res.json());
        
        texts.error 
        ? dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:texts.error}})
        : dispatch({type: fetchVotations.SUCCESS, payload: texts.fetchResponse})
    } catch (error) {
        dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg: error}})
    };
};

export const setCurrentVotationsAction = rcvsArr => ({type: setVotations.SET_CURRENT_VOTATIONS, payload: rcvsArr});
export const removeCurrentVotationsAction = () => ({type: fetchVotation.SUCCESS, payload: {}});
export const flushVotationsAction = () => ({type: setVotations.FLUSH_CURRENT_VOTATIONS});
export const resetTextListAction = () => ({type: fetchVotations.SUCCESS, payload: []});