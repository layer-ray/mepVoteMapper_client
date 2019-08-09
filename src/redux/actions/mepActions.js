import {fetchSortedMeps, 
        SET_MEP,
        POPUP_ERROR} from '../types';

const baseUrl = 'https://check-the-vote.herokuapp.com/mep'

export const fetchSortedMepsAction = () => async dispatch => {
    dispatch({type:fetchSortedMeps.LOADING});

    const reqUrl = baseUrl + '/sorted-meps';
    try {
        const meps = await fetch(reqUrl)
                            .then(res => res.json());
                            
        meps.error
            ? dispatch({type: POPUP_ERROR, error: meps.error})
            : dispatch({type: fetchSortedMeps.SUCCESS, payload: meps.fetchResponse});
    } catch(err){
        dispatch({type: POPUP_ERROR, error: err});
    };
};

export const setCurrentMepAction = mepData => ({type: SET_MEP, payload: mepData});