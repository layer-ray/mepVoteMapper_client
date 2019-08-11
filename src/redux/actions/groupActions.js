import {fetchGroups, SET_NOTIFICATION} from '../types';

const baseUrl = 'https://mep-vote-mapper.herokuapp.com/group'

export const fetchGroupsAction = () => async  dispatch => {
    dispatch({type: fetchGroups.LOADING});

    const reqUrl = baseUrl + '/get-groups';
    try {
        const groups = await fetch(reqUrl)
                            .then(res => res.json());
                            
        groups.error
            ? dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:groups.error}})
            : dispatch({type: fetchGroups.SUCCESS, payload: groups.fetchResponse});
    } catch(err){
        dispatch({type: SET_NOTIFICATION, payload: {type:'error', msg:err}});
    };
};