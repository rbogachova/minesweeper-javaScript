import {createSelector} from 'reselect';

function countCells(board, cellChecker) {
    let cellCount = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (cellChecker(board[rowIndex][columnIndex]))
                cellCount++;
        }
    return cellCount;
}

const selectBoard = state => state.board;

export const selectNotMinedCells = board => {
    const boardDimension = board.length;
    const allCells = boardDimension * boardDimension;
    const openNotMinedCells = countCells(board, cell => cell.isOpen && !cell.isBomb);

    return allCells - boardDimension - openNotMinedCells;
};

export const selectFlaggedCells = createSelector(
    [selectBoard],
    board => {
        return countCells(board, cell => cell.isFlagged);
    });