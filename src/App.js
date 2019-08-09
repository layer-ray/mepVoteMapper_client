import React from 'react';

import RcvForm from './components/rcvForm';
import ListWithOptions from './components/listWithOptions';
import Card from './components/card';
import Sidebar from './components/sidebar';
import Hemicycle from './components/draw';
import Notification from './components/notification';
import Spinner from './components/spinner';
import styles from './app.module.scss';

const App = () => {
    return (
    <div className={styles.main}>
        <Notification />
        <div className={styles.panel} >
            <RcvForm />
        </div>
        <div className={styles.title} >
            <ListWithOptions />
        </div>
        <div className={styles.card__info}>
            <Sidebar />
        </div>
        <div className={styles.card} >
            <Hemicycle />
        </div>
        <div className={styles.card__detail}>
            <Card />
        </div>
    </div>
    );
};

export default App;