export const openCell = (rowIndex, columnIndex) => ({
    type: 'OPEN_CELL',
    payload: {
        rowIndex,
        columnIndex
    }
});

export const labelCell = (rowIndex, columnIndex) => ({
    type: 'LABEL_CELL',
    payload: {
        rowIndex,
        columnIndex
    }
});

export const showAllBombs = () => ({
    type: 'SHOW_ALL_BOMBS',
});

export const restartGame = (gameLevel) => ({
    type: 'RESTART_GAME',
    payload: {
        gameLevel
    }
});

export const changeGameLevel = (gameLevel) => ({
    type: 'CHANGE_GAME_LEVEL',
    payload: {
        gameLevel
    }
});

export const startTimer = () => ({
    type: 'START_TIMER',
});

export const stopTimer = () => ({
    type: 'STOP_TIMER',
});

export const resetTimer = () => ({
    type: 'RESET_TIMER',
});
