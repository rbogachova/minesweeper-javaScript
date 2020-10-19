import React, {useState} from 'react';
import {connect} from "react-redux";
import Cell from "./Cell";
import {v4 as uuidv4} from 'uuid';
import {restartGame, showAllBombs} from "./redux/actions";
import './app.css';
import {Alert} from "antd";

function App(props) {
    function renderCell(cell) {
        return <Cell key={uuidv4()} cell={cell}/>;
    }

    function renderRow(row) {
        return <div key={uuidv4()}>{row.map(renderCell)}</div>;
    }

    const restart = () =>
        props.restartGame();

    const showAllBombs = () =>
        props.showAllBombs();

    const showGameOverMessage = () =>
        <Alert
            message="GAME OVER"
            type="error"
            closable
            onClick={restart}
        />;

    const showCongratulationsMessage = () =>
        <Alert
            message="CONGRATULATIONS! YOU WON!"
            type="success"
            closable
            onClick={restart}
        />;

    return (
        <div className="app">
            <h1>Minesweeper</h1>
            <p>Not Mined Cells: {props.notMinedCells}</p>
            <p> ☠️ ️ Bombs: {props.board.length - props.flaggedCells}</p>
            <button onClick={restart}>Restart</button>
            <button onClick={showAllBombs}>Show All Bombs</button>
            {props.board.map(renderRow)}
            {props.isGameEnded && showGameOverMessage()}
            {props.notMinedCells === 0 && showCongratulationsMessage()}
        </div>
    );
}

const mapStateToProps = state => ({
    board: state.board,
    isGameEnded: state.isGameEnded,
    notMinedCells: state.notMinedCells,
    flaggedCells: state.flaggedCells
});

const mapDispatchToProps = {
    restartGame,
    showAllBombs,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
