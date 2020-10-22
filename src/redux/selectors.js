import {createSelector} from 'reselect';
import {calculateNotMinedCells, calculateFlaggedCells} from './rootReducer';

const selectBoard = state => state.board;

export const selectNotMinedCells = createSelector(
    [selectBoard],
    calculateNotMinedCells);

export const selectFlaggedCells = createSelector(
    [selectBoard],
    calculateFlaggedCells);
