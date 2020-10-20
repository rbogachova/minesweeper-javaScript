function countOpenCells(board) {
    let openCells = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (board[rowIndex][columnIndex].isOpen)
                openCells++;
        }
    return openCells;
}

export function selectNotMinedCells(state) {
    const boardDimension = state.board.length;
    const allCells = boardDimension * boardDimension;
    const openCells = countOpenCells(state.board);

    return allCells - boardDimension - openCells;
}

export function selectFlaggedCells(state) {
    let board = state.board;
    let flaggedCells = 0;
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++)
        for (let columnIndex = 0; columnIndex < board[rowIndex].length; columnIndex++) {
            if (board[rowIndex][columnIndex].isFlagged)
                flaggedCells++;
        }
    return flaggedCells;
}

