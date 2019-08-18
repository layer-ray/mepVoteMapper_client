import React, {useState, useEffect} from 'react';
import Spinner from '../spinner';

import {connect} from 'react-redux';

import styles from './card.module.scss';
import flags from './flags.module.scss';
import {countryCodes} from './country-codes';

const Card = ({currentMep, currVotation}) => {

    const mepSelected = Object.keys(currentMep).length !== 0;
    const rcvSelected = Object.keys(currVotation).length !== 0;
    const [imgLoaded, setImgLoaded] = useState(true);
    const [country, setCountry] = useState({});

    useEffect(() => {
        let currCountry = countryCodes.find(code => {
            return code.name === currentMep.countryLabel
        });
        currCountry
            ? setCountry(currCountry)
            : setCountry({});

        // mep image loads after related data ( name, ...)
        // that's why this is needed
        setImgLoaded(false);
        if (mepSelected) {
            const imgSrc = new Image();
            imgSrc.src = `https://www.europarl.europa.eu/mepphoto/${currentMep.persId}.jpg`;
            imgSrc.onload = () => setImgLoaded(true);
        };
    }, [currentMep]);
    

    let vote;
    if (mepSelected && rcvSelected) {
        vote = currVotation.favour.includes(currentMep.voteName)
                    ? 'favour'
                    : currVotation.against.includes(currentMep.voteName)
                        ? 'against'
                        : currVotation.abstention.includes(currentMep.voteName)
                            ? 'non-voter'
                            : undefined;
    };


    return (
        <section className={styles.container}>
            <div  
                className={currentMep.fullName
                                ? styles.card 
                                : [styles.card, styles.hidden].join(" ")}
            >
                
                {imgLoaded  
                    ?   <>
                        <figure className={styles.photo}>
                            <img 
                                src={`https://www.europarl.europa.eu/mepphoto/${currentMep.persId}.jpg`}
                                alt={currentMep.fullName}
                            />
                            <div className={[flags.flag, flags[`flag-${country.code}`]].join(" ")}></div>
                        </figure>
                        <dl className={styles.fields}>
                            <dt>Name: </dt>
                            <dd>{currentMep.fullName}</dd>
                            <dt>EU Group: </dt>
                            <dd>{currentMep.politicalGroupLabel}</dd>
                            <dt>National Party:</dt>
                            <dd>{currentMep.nationalPoliticalGroupLabel}</dd>
                        </dl>
                        <footer className={styles.highlight}>
                            {vote && <span className={styles[vote]}>{vote.toUpperCase()}</span>}
                        </footer>
                        </>
                    :   <div className={styles.spinner}><Spinner /></div>
                }
            </div>
        </section>
    );
};

const mapStateToProps = state => ({
    currentMep: state.currentMep,
    currVotation: state.currVotation.curr,
});

export default connect(mapStateToProps)(Card);