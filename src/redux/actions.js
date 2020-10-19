export const openCell = (rowIndex, columnIndex) => ({
    type: 'OPEN_CELL',
    payload: {
        rowIndex,
        columnIndex
    }
});

export const flagCell = (rowIndex, columnIndex) => ({
    type: 'FLAG_CELL',
    payload: {
        rowIndex,
        columnIndex
    }
});

export const showAllBombs = () => ({
    type: 'SHOW_ALL_BOMBS',
});

export const restartGame = () => ({
    type: 'RESTART_GAME',
});

export const endGame = () => ({
    type: 'END_GAME',
});

