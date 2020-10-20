import React from 'react';
import {connect} from "react-redux";
import {openCell, labelCell, endGame} from "./redux/actions";
import './cell.css';
import 'antd/dist/antd.css';

function Cell(props) {
    const openCell = () => {
        if (props.cell.isOpen || props.isGameEnded)
            return;
        if (props.cell.isBomb)
            props.endGame();

        props.openCell(props.cell.rowIndex, props.cell.columnIndex);
    };

    const labelCell = e => {
        e.preventDefault();
        props.labelCell(props.cell.rowIndex, props.cell.columnIndex);
    };

    const renderCellContent = () => {
        if (!props.cell.isOpen) {
            if (props.cell.isFlagged)
                return '☠️';
            else if (props.cell.isQuestioned)
                return '?';
            else
                return null;
        }

        if (props.cell.bombCount === 0)
            return null;

        return props.cell.isBomb
            ? '💣' // TODO: change.
            : props.cell.bombCount;
    };

    const getCellClass = () =>
        props.cell.isOpen ? "openCell" : "initialCell";

    return (
        <span className={getCellClass()}
              onClick={openCell} onContextMenu={labelCell}>
            {renderCellContent()}
        </span>
    );
}

const mapStateToProps = state => ({
    board: state.board,
    isGameEnded: state.isGameEnded
});

const mapDispatchToProps = {
    openCell,
    labelCell,
    endGame
};

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
