let boardDimension;
export const easyLevel = 'easy';
export const mediumLevel = 'medium';
export const hardLevel = 'hard';

const generateRandomNumber = max =>
    Math.floor(Math.random() * max);

function setupBomb(freeCells) {
    let randomNumber = generateRandomNumber(freeCells.length - 1);
    freeCells[randomNumber].isBomb = true;
    freeCells.splice(randomNumber, 1);
}

function defineBoardDimension(gameLevel) {
    switch (gameLevel) {
        case easyLevel:
            return boardDimension = 4;
        case mediumLevel:
            return boardDimension = 6;
        case hardLevel:
            return boardDimension = 10;
    }
}

function createBoard(gameLevel) {
    boardDimension = defineBoardDimension(gameLevel);

    const board = [];
    const freeCells = [];

    for (let rowIndex = 0; rowIndex <= boardDimension - 1; rowIndex++) {
        board[rowIndex] = [];
        for (let columnIndex = 0; columnIndex <= boardDimension - 1; columnIndex++) {
            const cell = {
                isBomb: false,
                isOpen: false,
                bombCount: null,
                isFlagged: false,
                isQuestioned: false,
                rowIndex,
                columnIndex
            };

            board[rowIndex][columnIndex] = cell;
            freeCells.push(cell);
        }
    }
    for (let i = 1; i <= boardDimension; i++)
        setupBomb(freeCells);

    return board;
}

const createState = (gameLevel) => ({
    board: createBoard(gameLevel),
    isGameEnded: false,
    gameLevel,
    stopwatch: {
        isActive: false,
        timerTime: 0
    }
});

function checkCellIsValid(board, rowIndex, columnIndex) {
    const rowLength = board.length;
    const columnLength = board[0].length;
    return rowIndex >= 0 &&
        rowIndex < rowLength &&
        columnIndex >= 0 &&
        columnIndex < columnLength;
}

function checkHasBomb(board, rowIndex, columnIndex) {
    return checkCellIsValid(board, rowIndex, columnIndex) &&
        board[rowIndex][columnIndex].isBomb;
}

function calculateBombCount(board, rowIndex, columnIndex) {
    let bombCounter = 0;
    for (let rowIndexAdjustment = -1; rowIndexAdjustment <= 1; rowIndexAdjustment++) {
        for (let columnIndexAdjustment = -1; columnIndexAdjustment <= 1; columnIndexAdjustment++) {
            if (rowIndexAdjustment === 0 && columnIndexAdjustment === 0)
                continue;
            if (checkHasBomb(board, rowIndex + rowIndexAdjustment, columnIndex + columnIndexAdjustment))
                bombCounter++;
        }
    }
    return bombCounter;
}

function showAllBombs(board) {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (board[rowIndex][columnIndex].isBomb)
                board[rowIndex][columnIndex].isOpen = true;
        }
    }
}

export function countCells(board, cellChecker) {
    return board
        .map(row => row.reduce((acc, cell) => cellChecker(cell) ? acc + 1 : acc, 0))
        .reduce((acc, rowCellCount) => acc + rowCellCount);
}

export function calculateNotMinedCells(board) {
    const boardDimension = board.length;
    const allCellCount = boardDimension * boardDimension;
    const openNotMinedCellCount = countCells(board, cell => cell.isOpen && !cell.isBomb);

    return allCellCount - boardDimension - openNotMinedCellCount;
}

function openCell(state, rowIndex, columnIndex) {
    if (!checkCellIsValid(state.board, rowIndex, columnIndex))
        return;

    const cell = state.board[rowIndex][columnIndex];
    if (cell.isOpen)
        return;

    cell.isOpen = true;
    if (cell.isBomb) {
        showAllBombs(state.board);
        state.isGameEnded = true;
        return;
    }

    if (calculateNotMinedCells(state.board) === 0) {
        state.isGameEnded = true;
        return;
    }

    cell.bombCount = calculateBombCount(state.board, rowIndex, columnIndex);
    if (cell.bombCount !== 0)
        return;
    for (let rowIndexAdjustment = -1; rowIndexAdjustment <= 1; rowIndexAdjustment++) {
        for (let columnIndexAdjustment = -1; columnIndexAdjustment <= 1; columnIndexAdjustment++) {
            if (rowIndexAdjustment === 0 && columnIndexAdjustment === 0)
                continue;
            openCell(state, rowIndex + rowIndexAdjustment, columnIndex + columnIndexAdjustment);
        }
    }
}

const copyBoard = board =>
    board.map(row => row.map(column => column));

export const calculateFlaggedCells = board =>
    countCells(board, cell => cell.isFlagged);

function labelCell(cell, board) {
    const flaggedCells = calculateFlaggedCells(board);

    if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.isQuestioned = true;
    } else if (cell.isQuestioned) {
        cell.isQuestioned = false;
    } else if (flaggedCells < boardDimension) {
        cell.isFlagged = true;
    } else if (flaggedCells === boardDimension) {
        cell.isQuestioned = true;
    }
}

const updateTimerTime = time => time + 1;

export const rootReducer = (state = createState(easyLevel), action) => {
    switch (action.type) {
        case 'OPEN_CELL': {
            const newBoard = copyBoard(state.board);
            const newState = {...state, board: newBoard};
            openCell(newState, action.payload.rowIndex, action.payload.columnIndex);

            return newState;
        }

        case 'LABEL_CELL': {
            const newBoard = copyBoard(state.board);
            const currentCell = newBoard[action.payload.rowIndex][action.payload.columnIndex];
            labelCell(currentCell, newBoard);

            return {...state, board: newBoard};
        }

        case 'RESTART_GAME': {
            return createState(action.payload.gameLevel);
        }

        case 'SHOW_ALL_BOMBS': {
            const newBoard = copyBoard(state.board);
            showAllBombs(newBoard);

            return {...state, board: newBoard};
        }

        case 'CHANGE_GAME_LEVEL': {
            return createState(action.payload.gameLevel);
        }

        case 'START_TIMER': {
            const newStopwatch = {...state.stopwatch};
            console.log("Clicked");

            setInterval(() => {
                updateTimerTime(newStopwatch.timerTime);
            }, 1000);

            return {...state, stopwatch: newStopwatch};
        }

        case 'STOP_TIMER': {
            return {...state, isGameEnded: true};
        }

        case 'RESET_TIMER': {
            return {...state, isGameEnded: true};
        }
    }
    return state;
};
