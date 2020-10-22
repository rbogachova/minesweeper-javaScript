import React from 'react';
import {connect} from 'react-redux';
import {startTimer, stopTimer} from './redux/actions';

function StopwatchRedux(props) {
    return (
        <div>
            <button onClick={props.startTimer}>Start Timer</button>
            <button onClick={props.stopTimer}>Stop Timer</button>
            Stopwatch: {props.stopwatch.timerTime}
        </div>
    );
}

const mapStateToProps = state => ({
    stopwatch: state.stopwatch
});

const mapDispatchToProps = {
    startTimer,
    stopTimer
};

export default connect(mapStateToProps, mapDispatchToProps)(StopwatchRedux);
