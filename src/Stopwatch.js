import React from 'react';
import {connect} from "react-redux";

function Stopwatch(props) {
    return (
        <div>
            Stopwatch: {
            props.stopwatch.isTimerOn &&
            props.stopwatch.timerTime
        }
        </div>
    );
}

const mapStateToProps = state => ({
    board: state.board,
    stopwatch: state.stopwatch
});

export default connect(mapStateToProps, null)(Stopwatch);
