import React, {useEffect, useState} from 'react';

function Stopwatch() {
    const [timerTime, setTimerTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTimerTime(time => time + 1);
            }, 1000);
        } else if (!isActive && timerTime !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timerTime]);

    function startTimer() {
        setIsActive(true);
    }

    function stopTimer() {
        setIsActive(false);
    }

    return (
        <div>
            <button onClick={startTimer}>Start Timer</button>
            <button onClick={stopTimer}>Stop Timer</button>
            Stopwatch: {timerTime}
        </div>
    );
}

export default Stopwatch;
