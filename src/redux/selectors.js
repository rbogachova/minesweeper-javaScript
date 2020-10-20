import {createSelector} from 'reselect';

function countOpenCells(board) {
    let openCells = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (board[rowIndex][columnIndex].isOpen)
                openCells++;
        }
    return openCells;
}

function countFlaggedCells(board) {
    let flaggedCells = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (board[rowIndex][columnIndex].isFlagged)
                flaggedCells++;
        }
    return flaggedCells;
}

const selectBoard = state => state.board;

export const selectNotMinedCells = createSelector(
    [selectBoard],
    board => {
        const boardDimension = board.length;
        const allCells = boardDimension * boardDimension;
        const openCells = countOpenCells(board);

        return allCells - boardDimension - openCells;
    }
);

export const selectFlaggedCells = createSelector([selectBoard], countFlaggedCells);

