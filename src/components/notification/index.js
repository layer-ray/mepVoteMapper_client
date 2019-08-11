import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import {cleanUpNotification} from '../../redux/actions/notificationActions';
import style from './notification.module.scss';

const Notification = ({currState}) => {
    
    const  [visible, setVisible] = useState([]);
    const  [timer, setTimer] = useState(null);

    const display = () => {
        setVisible(style.visible);
        const active = setTimeout(() => {
            setVisible([]);
            setTimer(null)
        }, 3000);
        setTimer(active);
    };

    useEffect(() => {
        if(timer) {
            setVisible(style.reset);
            clearTimeout(timer);
            setTimer(null);
            setTimeout(display, 100);
        } else if(currState.msg) {
            display();
        } else {
            setVisible([]);
        }
    }, [currState]);
    
    return (
        <aside 
            className={[style.notification,
                        style[currState.type],
                        visible].join(" ")} 
        >
                <p>
                    {typeof currState.msg === "string" 
                        ? currState.msg 
                        : currState.msg.toString()
                    }
                </p>
        </aside>
    );
};

const mapStateToProps = state => ({
    currState: state.notification
});

const mapDispatchToProps = dispatch => ({
    cleanUp: () => {
        dispatch(cleanUpNotification())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Notification);