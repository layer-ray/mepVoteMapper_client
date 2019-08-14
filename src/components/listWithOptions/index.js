import React from 'react';
import {connect} from 'react-redux';

import Spinner from '../spinner';

import {fetchVotationAction,
        setCurrentVotationsAction,
        flushVotationsAction,
        resetTextListAction,
        removeCurrentVotationsAction} from '../../redux/actions/votationActions';

import styles from './listOption.module.scss';

const ListWithOptions = props => {

    const {currVotations, 
           setCurrentVotations, 
           flushCurrentVotations, 
           textList, resetTextList,
           getVotation, textLoading} = props;
   
   // await used for clarity
    const setRcvs = async e => {
        const {id} = e.target;
        const {rcvs} = textList.find(text => 
            text._id === id);
        await setCurrentVotations(rcvs);
    };

    const setCurrentRcv = async e => {
        await getVotation(e.target.id);
    }

    
    const createLink = id => {
        const transformer = /(\w)(\d)-(\d{4})\/(\d{4})/;
        let textLink = id.replace(transformer, '$1-$2-$4-$3');
        return  `http://www.europarl.europa.eu/doceo/document/${textLink}_EN.html`;
    };

    return (
        <section className={styles.container}>
        {textLoading 
            ?    <div className={styles.spinner}><Spinner /></div>
            :   textList.length === 0
                    ?   <p className={styles.title}>
                            Search for a text using the panel on the left to discover: 
                            <span>
                                How did they vote?
                            </span>
                        </p>
                    :   currVotations.length === 0 
                        ?   <ul className={styles.main_list}>
                                <button 
                                    onClick={resetTextList}
                                >&times;</button>
                                {textList.map(text => 
                                    <li 
                                        key={text._id}
                                        id={text._id}
                                        onClick={setRcvs}
                                    >{text.title}</li>
                                )}
                            </ul>
                        :   <ul>
                                <button 
                                    onClick={flushCurrentVotations}
                                >BACK</button>

                                    <a
                                        href={createLink(currVotations[0].ABNumber)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                                <li className={styles.firstListItem}>
                                        READ TEXT
                                </li>
                                    </a>
                                {currVotations.map(rcv => 
                                    <li
                                        key={rcv._id}
                                        id={rcv._id}
                                        onClick={setCurrentRcv}
                                    >
                                        {rcv.type || rcv.title}
                                    </li>)}
                            </ul>
        }
        </section>
    );
};

const mapStateToProps = state => ({
    textList: state.textList.curr,
    textLoading: state.textList.loading,
    currVotations: state.currVotations
});

const mapDispatchToProps = dispatch => ({
    setCurrentVotations: rcvs => {
        dispatch(setCurrentVotationsAction(rcvs));
    },
    flushCurrentVotations: () => {
        dispatch(flushVotationsAction());
        dispatch(removeCurrentVotationsAction());
    },
    resetTextList: () => {
        dispatch(resetTextListAction())
    },
    getVotation: id => {
        dispatch(fetchVotationAction(id));
    },
})
export default connect(mapStateToProps, mapDispatchToProps)(ListWithOptions);