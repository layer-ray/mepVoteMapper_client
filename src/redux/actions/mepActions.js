import {fetchSortedMeps, 
        SET_MEP,
        SET_NOTIFICATION} from '../types';

const baseUrl = 'https://mep-vote-mapper.herokuapp.com/mep'

export const fetchSortedMepsAction = () => async dispatch => {
    dispatch({type:fetchSortedMeps.LOADING});

    const reqUrl = baseUrl + '/sorted-meps';
    try {
        const meps = await fetch(reqUrl)
                            .then(res => res.json());
                            
        meps.error
            ? dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:meps.error}})
            : dispatch({type: fetchSortedMeps.SUCCESS, payload: meps.fetchResponse});
    } catch(err){
        dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:err}});
    };
};

export const setCurrentMepAction = mepData => ({type: SET_MEP, payload: mepData});