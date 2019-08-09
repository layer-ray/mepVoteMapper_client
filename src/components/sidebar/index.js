import React from 'react';
import {connect} from 'react-redux';

import styles from './sidebar.module.scss';

const Sidebar = ({currVotation}) => {
    return (
        <aside className={currVotation.ABNumber ? '' : styles.hidden}>
            <dl className={styles.fields}>
                <dt>Law proposal:</dt>
                <dd>{currVotation.ABNumber}</dd>
                <dt>Votation:</dt>
                <dd>{currVotation.type || currVotation.title}</dd>
                {currVotation.rapporteur &&
                    <>
                        <dt>Rapporteur:</dt>
                        <dd>{currVotation.rapporteur}</dd>
                    </>
                }
            </dl>
        </aside>
    );
};

const mapStateToProps = state => ({
    currVotation: state.currVotation.curr
});

export default connect(mapStateToProps)(Sidebar);