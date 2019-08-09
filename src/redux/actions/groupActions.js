import {fetchGroups, POPUP_ERROR} from '../types';

const baseUrl = 'http://localhost:5000/group'

export const fetchGroupsAction = () => async  dispatch => {
    dispatch({type: fetchGroups.LOADING});

    const reqUrl = baseUrl + '/get-groups';
    try {
        const groups = await fetch(reqUrl)
                            .then(res => res.json());
                            
        groups.error
            ? dispatch({type: POPUP_ERROR, error: groups.error})
            : dispatch({type: fetchGroups.SUCCESS, payload: groups.fetchResponse});
    } catch(err){
        dispatch({type: POPUP_ERROR, error: err});
    };
};