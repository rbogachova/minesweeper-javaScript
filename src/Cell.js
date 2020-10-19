import React from 'react';
import {connect} from "react-redux";
import {openCell, flagCell, endGame} from "./redux/actions";
import './cell.css';
import 'antd/dist/antd.css';

function Cell(props) {
    const openCell = () => {
        if (props.cell.isOpen)
            return;
        if (props.cell.isBomb)
            props.endGame();

        props.openCell(props.cell.rowIndex, props.cell.columnIndex);
    };

    const flagCell = (e) => {
        e.preventDefault();
        props.flagCell(props.cell.rowIndex, props.cell.columnIndex);
    };

    const renderCellContent = () => {
        if (!props.cell.isOpen)
            return props.cell.isFlagged ? '☠️' : null;

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
              onClick={openCell} onContextMenu={flagCell}>
            {renderCellContent()}
        </span>
    );
}

const mapStateToProps = state => ({
    board: state.board
});

const mapDispatchToProps = {
    openCell,
    flagCell,
    endGame
};

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
