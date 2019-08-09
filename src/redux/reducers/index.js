import {combineReducers} from 'redux';

import {sortedMepsReducer, 
        currentMepReducer,
        } from './mepReducer';
import {groupReducer} from './groupReducer';
import {notificationReducer} from './notificationReducer';
import {textListReducer, votationReducer, 
        currentVotationsReducer} from './votationReducer';
import {errorReducer} from './errorReducer';

const rootReducer = combineReducers({
    sortedMeps: sortedMepsReducer,
    currentMep: currentMepReducer,
    groups: groupReducer,
    textList: textListReducer,
    notification: notificationReducer,
    errors: errorReducer,
    currVotations: currentVotationsReducer,
    currVotation: votationReducer
});

export default rootReducer;