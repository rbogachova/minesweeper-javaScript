let boardDimension;
let initialGameLevel = "medium";

const generateRandomNumber = (max) =>
    Math.floor(Math.random() * max);

function setupBomb(freeCells) {
    let randomNumber = generateRandomNumber(freeCells.length - 1);
    freeCells[randomNumber].isBomb = true;
    freeCells.splice(randomNumber, 1);
}

function defineBoardDimension(gameLevel) {
    switch (gameLevel) {
        case "easy":
            return boardDimension = 4;
        case "medium":
            return boardDimension = 6;
        case "hard":
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

const createInitialState = (gameLevel) => {
    const boardDimension = defineBoardDimension(gameLevel);

    return {
        board: createBoard(gameLevel),
        notMinedCells: (boardDimension * boardDimension) - boardDimension,
        flaggedCells: 0,
        isGameEnded: false,
        gameLevel,
        stopwatch: {
            isTimerOn: false,
            timerTime: 0
        }
    };
};

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

function openCell(board, rowIndex, columnIndex, notMinedCells, stopwatch) {
    if(notMinedCells === board.length * board.length)
        stopwatch.isTimerOn = true;

    if (!checkCellIsValid(board, rowIndex, columnIndex))
        return notMinedCells;

    const cell = board[rowIndex][columnIndex];
    if (cell.isOpen)
        return notMinedCells;

    cell.isOpen = true;
    if (cell.isBomb) {
        showAllBombs(board);
        return notMinedCells;
    }
    notMinedCells--;

    cell.bombCount = calculateBombCount(board, rowIndex, columnIndex);
    if (cell.bombCount !== 0)
        return notMinedCells;
    for (let rowIndexAdjustment = -1; rowIndexAdjustment <= 1; rowIndexAdjustment++) {
        for (let columnIndexAdjustment = -1; columnIndexAdjustment <= 1; columnIndexAdjustment++) {
            if (rowIndexAdjustment === 0 && columnIndexAdjustment === 0)
                continue;
            notMinedCells = openCell(board, rowIndex + rowIndexAdjustment, columnIndex + columnIndexAdjustment, notMinedCells);
        }
    }
    return notMinedCells;
}

function copyBoard(board) {
    let newBoard = [];
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        newBoard[rowIndex] = [];
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            newBoard[rowIndex][columnIndex] = {...board[rowIndex][columnIndex]};
        }
    }
    return newBoard;
}

function labelCell(cell, flaggedCells) {
    if (cell.isFlagged) {
        cell.isFlagged = false;
        flaggedCells--;
        cell.isQuestioned = true;
    } else if (cell.isQuestioned) {
        cell.isQuestioned = false;
    } else if (!cell.isFlagged && !cell.isQuestioned && flaggedCells < boardDimension) {
        cell.isFlagged = true;
        flaggedCells++;
    } else if (!cell.isFlagged && flaggedCells === boardDimension) {
        cell.isQuestioned = true;
    }

    return flaggedCells;
}

function increaseTime (time) {
    return time + 1;
}

export const rootReducer = (state = createInitialState(initialGameLevel), action) => {
    switch (action.type) {
        case 'OPEN_CELL': {
            const newBoard = copyBoard(state.board);
            const newNotMinedCells = state.notMinedCells;
            const notMinedCells = openCell(newBoard, action.payload.rowIndex, action.payload.columnIndex, newNotMinedCells);

            return {...state, board: newBoard, notMinedCells: notMinedCells};
        }

        case 'LABEL_CELL': {
            const newBoard = copyBoard(state.board);
            let newFlaggedCells = state.flaggedCells;

            const currentCell = newBoard[action.payload.rowIndex][action.payload.columnIndex];
            newFlaggedCells = labelCell(currentCell, newFlaggedCells);

            return {...state, board: newBoard, flaggedCells: newFlaggedCells};
        }

        case 'RESTART_GAME': {
            return createInitialState(action.payload.gameLevel);
        }

        case 'SHOW_ALL_BOMBS': {
            const newBoard = copyBoard(state.board);
            showAllBombs(newBoard);

            return {...state, board: newBoard};
        }

        case 'END_GAME': {
            return {...state, isGameEnded: true};
        }

        case 'CHANGE_GAME_LEVEL': {
            const newGameLevel = action.payload.gameLevel;
            const newBoard = createBoard(newGameLevel);
            const newNotMinedCells = (newBoard.length * newBoard.length - newBoard.length);


            return {...state, board: newBoard, gameLevel: newGameLevel, notMinedCells: newNotMinedCells};
        }

        case 'START_TIMER': {
            let newTimerTime = state.stopwatch.timerTime;
            newTimerTime = setInterval(increaseTime(newTimerTime), 1000);

            return {
                ...state,
                stopwatch: {...state.stopwatch, isTimerOn: true, timerTime: newTimerTime}
            };
        }
    }
    return state;
};