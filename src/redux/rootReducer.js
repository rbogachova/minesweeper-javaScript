const boardDimension = 6;

const generateRandomNumber = (max) =>
    Math.floor(Math.random() * max);

function setupBomb(freeCells) {
    let randomNumber = generateRandomNumber(freeCells.length - 1);
    freeCells[randomNumber].isBomb = true;
    freeCells.splice(randomNumber, 1);
}

function createBoard() {
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

const createInitialState = () => ({
    board: createBoard(),
    notMinedCells: (boardDimension * boardDimension) - boardDimension,
    flaggedCells: 0,
    isGameEnded: false
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

function openCell(board, rowIndex, columnIndex, notMinedCells) {
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

export const rootReducer = (state = createInitialState(), action) => {
    switch (action.type) {
        case 'OPEN_CELL': {
            const newBoard = copyBoard(state.board);
            const newNotMinedCells = state.notMinedCells;
            const notMinedCells = openCell(newBoard, action.payload.rowIndex, action.payload.columnIndex, newNotMinedCells);

            return {...state, board: newBoard, notMinedCells: notMinedCells};
        }

        case 'FLAG_CELL': {
            const newBoard = copyBoard(state.board);
            let newFlaggedCells = state.flaggedCells;

            const cell = newBoard[action.payload.rowIndex][action.payload.columnIndex];
            if (cell.isFlagged) {
                cell.isFlagged = false;
                newFlaggedCells--;
            } else {
                cell.isFlagged = true;
                newFlaggedCells++;
            }

            return {...state, board: newBoard, flaggedCells: newFlaggedCells};
        }

        case 'RESTART_GAME': {
            return createInitialState();
        }

        case 'SHOW_ALL_BOMBS': {
            const newBoard = copyBoard(state.board);
            showAllBombs(newBoard);

            return {...state, board: newBoard};
        }

        case 'END_GAME': {
            return {...state, isGameEnded: true};
        }
    }
    return state;
};