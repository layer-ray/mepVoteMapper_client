import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {fetchSortedMepsAction,
        setCurrentMepAction} from '../../redux/actions/mepActions';
import {setError} from '../../redux/actions/errorActions';
import {fetchGroupsAction} from '../../redux/actions/groupActions';
import {setNotification} from '../../redux/actions/notificationActions';

import Spinner from '../spinner';

// mep coords organized from inner to outer, from right to left
import sortedHemiCoords from './sortedCoords.js';
import styles from './draw.module.scss';

const Draw = props => {

    const {getSortedMeps, getGroups, 
           setCurrentMep, sortedMeps, 
           currGroups, currentMep,
           sMLoading, currVotation,
           displayNotification,
           errors, setError} = props;

    const [positionedMeps, setPositionedMeps] = useState({});
    const [hiddenGroups, setHiddenGroups] = useState([]);
    // toggle fit better than set, follow conventions?
    const [rcvVotes, setRcvVotes] = useState(true);

    const [mepField, setMepField] = useState('');

    useEffect( () => {
        (async () => {
            await getGroups();
            await getSortedMeps();
        })();
    }, []);

    useEffect( () => {
        // if a mep is selected when a votation is set
        // if the selected mep was not present at votation time
        // it will be unselected
        if(currVotation.favour &&
            (!currVotation.favour.includes(currentMep.voteName) 
            || currVotation.against.includes(currentMep.voteName)
            || currVotation.abstention.includes(currentMep.voteName)))
        setCurrentMep({});
    }, [currVotation, rcvVotes]);

    useEffect( () => {
        // custom sorting - place non attached members in
        // the last two rows of the hemicycle
        
        // LtR goes from 7 to 1.Non-placed members are in tail with LtR -1
        const firstNonPlaced = sortedMeps.findIndex(el => el.group_info && el.group_info[0].LtR === -1);
        // extract the placed meps and reverse the array to accomodate them
        // to the sorted dots
        const placedArr = sortedMeps.slice(0, firstNonPlaced).reverse();
        const toPlaceArr = sortedMeps.slice(firstNonPlaced);

        let groupsObj = {};
        for (let i=0; i < sortedHemiCoords.length; i++) {
            if (sortedHemiCoords[i].pos) {            
                const row = parseInt(sortedHemiCoords[i].pos.split('|')[0]);

                let el = (row === 10 || row === 11) && toPlaceArr.length > 0 
                            ? toPlaceArr.pop()
                            : placedArr.pop();

                if (el) {
                    el.x = sortedHemiCoords[i].x;
                    el.y = sortedHemiCoords[i].y;
        
                    // split meps by group 
                    groupsObj[el.group_info[0].acronim] 
                        ? groupsObj[el.group_info[0].acronim].push(el)
                        : groupsObj[el.group_info[0].acronim] = [el]
                };
            } else {
                displayNotification({type:'error', msg: 'Coordinates file not found'});
            }
        };
        setPositionedMeps(groupsObj);
    }, [sortedMeps])

    function setMep(e) {
        const target = e.target.tagName.toLowerCase();
        let mepObj = {};
        // extracting fill property from svg circle's style object to 
        // avoid selection of 'not-displayed' meps when votation is displayed
        if (target === 'circle' && e.target.style.fill !== "rgb(255, 255, 255)") {
            mepObj = sortedMeps.find(mep => mep._id === e.target.id);
        } else if (target === 'form') {
            e.preventDefault();            
            mepObj = sortedMeps.find(mep => mep.voteName.toLowerCase() === mepField.toLowerCase());
            setMepField("");
        } else return;

        mepObj
            ? setCurrentMep(mepObj)
            : setError("no mep found");
    };

    function inputHandler(e){
        setMepField(e.target.value);
        setError("");
    };

    function toggleGroup(e) {
        let newState = 
            hiddenGroups.includes(e.target.id) 
                ? hiddenGroups.filter(el => el !== e.target.id)
                : [...hiddenGroups, e.target.id]

        setHiddenGroups(newState);
    };
    

    return (
        <div onClick={setMep} className={styles.container}>
            {/* SVG HEMICYCLE */}
            {
                (sMLoading || sortedMeps.length === 0)
                    ?   <div className={styles.spinner}>
                            <Spinner />
                        </div>
                    :    <svg xmlns="http://www.w3.org/2000/svg" 
                            width="480" height="330"
                            viewBox="150 30 500 360"
                            className="svg-root" id="svg-root">
                        <path d="M471.72 301.93 A 75 75 0 0 0 467.97 248.3 L611.17 181.53 A 233 233 1 0 1 622.82 348.12 L471.72 301.93 " fill="none" stroke="#222"/>
                        <path d="M467.41 247.12 A 75 75 0 0 0 428.1 210.46 L487.28 63.97 A 233 233 1 0 1 609.42 177.86 L467.41 247.12 " fill="none" stroke="#222"/>
                        <path d="M426.88 209.98 A 75 75 0 0 0 373.12 209.98 L316.5 62.48 A 233 233 1 0 1 483.5 62.48 L426.88 209.98 " fill="none" stroke="#222"/>
                        <path d="M371.9 210.46 A 75 75 0 0 0 332.59 247.12 L190.58 177.86 A 233 233 1 0 1 312.72 63.97 L371.9 210.46 " fill="none" stroke="#222"/>
                        <path d="M332.03 248.3 A 75 75 0 0 0 328.28 301.93 L177.18 348.12 A 233 233 1 0 1 188.83 181.53 L332.03 248.3 " fill="none" stroke="#222"/>
                            {
                                Object.keys(positionedMeps).map(group => {
                                return (  <g key={group} 
                                                id={group}
                                                className={hiddenGroups.includes(group) ? styles.hidden : ''}
                                            >
                                    {positionedMeps[group].map( dot => {
                                        let color = '#fff';
                                        if (rcvVotes && Object.keys(currVotation).length !== 0) {
                                            if(currVotation.favour.includes(dot.voteName)) {
                                                color = '#2a2';
                                            } else if(currVotation.against.includes(dot.voteName)) {
                                                color = '#a22';
                                            } else if (currVotation.abstention.includes(dot.voteName)) {
                                                color = '#444';
                                            };
                                        } else {
                                            color = dot.group_info[0].idColor
                                        };
                                        
                                        return (<circle cx={dot.x} cy={dot.y} r="4"
                                                className={dot._id === currentMep._id ? styles.active : ''}
                                                style={{fill: color}}
                                                id={dot._id}
                                                key={dot._id}/>
                                        )
                                        }
                                    )}
                                </g> )
                                })
                            }
                        </svg>
            }

            {/* TOGGLE VOTATION BUTTON */}
            <button 
                onClick={() => setRcvVotes(!rcvVotes)}
                disabled={Object.keys(currVotation).length === 0}
                className={[styles.toggleBtn, rcvVotes ? styles.active : styles.inactive].join(" ")}
                >
                Toggle votation result
            </button>
            {/* GROUPS CHECKBOXES */}
            <div className={styles.checkbox_list}>
            {
                currGroups.map(el => 
                    <div 
                        key={el._id} 
                        className={styles.field}
                    >
                        <label>
                            <div className={styles.custom_checkbox}>
                                <input type="checkbox"  
                                    value={el.acronim}
                                    id={el.acronim}
                                    onChange={toggleGroup}
                                    checked={!hiddenGroups.includes(el.acronim)}
                                />
                                <span style={{backgroundColor: el.idColor}}></span>
                            </div>
                            {el.acronim}
                        </label>
                    </div>
                    )
            }
            </div>
            {/* MONOFIELDFORM */}
            <form 
                onSubmit={setMep} 
                className={styles.monoFieldForm}>
                <label htmlFor="mep">Search mep:</label>
                <input 
                    type="text"
                    size="1"
                    onChange={inputHandler}
                    value={mepField}
                />
                <input 
                    type="submit" 
                    value="&#8627;" 
                    disabled={mepField.length === 0}
                />
                {errors.drawForm && <small className={styles.caption}>{errors.drawForm}</small>}
            </form>
            
        </div>
    );
};

const mapDispatchToProps = dispatch =>  ({
    getSortedMeps: () => {
        dispatch(fetchSortedMepsAction())
    },
    getGroups: () => {
        dispatch(fetchGroupsAction())
    },
    setCurrentMep: mepId => {
        dispatch(setCurrentMepAction(mepId))
    },
    displayNotification: data => {
        dispatch(setNotification(data))
    },
    setError: msg => {
        dispatch(setError({source: 'drawForm', msg}))
    }
});

const mapStateToProps = state => ({
    sortedMeps: state.sortedMeps.curr,
    sMLoading: state.sortedMeps.loading,
    currGroups: state.groups.curr,
    currentMep: state.currentMep,
    currVotation: state.currVotation.curr,
    errors: state.errors
});

export default connect(mapStateToProps, mapDispatchToProps)(Draw);