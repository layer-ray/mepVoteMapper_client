import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';

import {fetchVotationsByDates, 
        fetchVotationsByTextTitle} from '../../redux/actions/votationActions';
import {setError} from '../../redux/actions/errorActions';

import styles  from './rcv_form.module.scss';

const RcvForm = props => {
    const {getRcvsByTextTitle, getRcvsByDates,
        textList, setError, errors} = props;
    const [activeSelect, setActiveSelect] = useState('word');
    const [textData, setTextData] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [dates, setDates] = useState({from: "", to: ""});
    const maxTime = useRef(null);


    useEffect(() => {
        // on mount set the max date for the date picker
        const currTime = new Date();
        const year = currTime.getFullYear();
        const month = currTime.getMonth() + 1;
        const day = currTime.getDate();

        maxTime.current =  `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`;
    }, []);

    useEffect(() => {
        if (initialized && textList.length === 0) {
            setError("no text found");
        };
        setInitialized(false);
    }, [textList]);


    const fetchCurrTexts = async e => {        
        e.preventDefault();

        if(activeSelect === 'word') {
            setTextData("");
            setInitialized(true);
            await getRcvsByTextTitle(textData);
        } else {
            if(dates.from && dates.to) {
                setInitialized(true);
                await getRcvsByDates(dates)
            } else {
                setError("Invalid range");
            }
        };
    };

    const inputHandler = e => {
        setTextData(e.target.value);
        setError("");
    };

    const dateHandler = e => {
        setError("");
        const {value, id} = e.target;
        const left = id === 'from' ? 'to' : 'from';
        if (value && dates[left]) {
                const d1 = new Date(value);
                const d2 = new Date(dates[left]);
                if (left === 'from' && d1 < d2 || left === 'to' && d1 > d2) {
                    return setError("From cannot be greater than to");
                }
        }
        setDates({...dates, [id]:value});
    }
    const handleSelectChange = e => {
        setActiveSelect(e.target.value);
        setError("");
    };
    
    const isCompiled = activeSelect === "word" && textData.length > 0
                        ||
                       activeSelect === "dates" && dates.from.length > 0 && dates.to.length > 0;

    return (
        <form 
            onSubmit={fetchCurrTexts}
            className={styles.formContainer}
        >
            <div className={styles.formField}>
                <label 
                    htmlFor="selection-mode"
                    className={styles.selectLabel}
                >
                    Search votations: 
                </label>
                <div className={[styles.styledSelect, styles.rounded].join(" ")}>            
                    <select 
                        name="mode" 
                        id="selection-mode"
                        onChange={handleSelectChange}
                    >
                        <option value="word">by title word</option>
                        <option value="dates">by dates</option>
                    </select>
                </div>
            </div>
            <p className={styles.helperText}>
                Plenary votations exposed by this application are mainly about amendments to 
                texts proposed by the commission.
                It is possible to search for a text by word(s) in the text title or by votation dates.
                In the first case the text is presented with all its (voted) amendments; when
                looked up through dates text includes only the votations happened within the 
                selected time range.
            </p>
            <div className={styles.formField}>
                
            {activeSelect === 'word'
            ?   <>
                    <label htmlFor="rcvTitle">Word(s) in title: </label>
                    <input 
                        type="text"
                        size="1"
                        name="rcvTitle" 
                        id="rcvTitle"
                        className={styles.textInput}
                        onChange={inputHandler}
                        value={textData}
                    />
                </>
                    
                :  <>
                        <div>
                            <label 
                                htmlFor="from"
                            >
                                From: 
                            </label>
                            <input 
                                type="date" 
                                name="from" 
                                id="from"
                                min="2012-07-02"
                                max={maxTime.current}
                                onChange={dateHandler}
                                value={dates.from}
                            />
                        </div>
                        <div>
                            <label 
                                htmlFor="to"
                            >
                                To: 
                            </label>
                            <input 
                                type="date" 
                                name="to" 
                                id="to"
                                min="2019-07-02"
                                max={maxTime.current}
                                onChange={dateHandler}
                                value={dates.to}
                            />
                        </div>
                    </>
                }
            {errors.rcvForm &&
                <small className={styles.caption}>{errors.rcvForm}</small>}
                </div>
            <input 
                type="submit" 
                value="search"
                disabled={!isCompiled}
                className={styles.submitBtn}    
            />
        </form>
    );
};

const mapStateToProps = state => ({
    textList: state.textList.curr,
    errors: state.errors
});

const mapDispatchToProps = dispatch => ({
    getRcvsByTextTitle: words => {
        dispatch(fetchVotationsByTextTitle(words));
    },
    getRcvsByDates : dates => {
        dispatch(fetchVotationsByDates(dates));
    },
    setError: msg => {
        dispatch(setError({source: 'rcvForm', msg}));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(RcvForm) 