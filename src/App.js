import React from 'react';
import {connect} from "react-redux";
import Cell from "./Cell";
import {v4 as uuidv4} from 'uuid';
import {restartGame, showAllBombs, changeGameLevel} from "./redux/actions";
import './app.css';
import {Alert} from "antd";
import Stopwatch from "./Stopwatch";
import {selectNotMinedCells} from "./redux/rootReducer";

function App(props) {
    function renderCell(cell) {
        return <Cell key={uuidv4()} cell={cell}/>;
    }

    function renderRow(row) {
        return <div key={uuidv4()}>{row.map(renderCell)}</div>;
    }

    const changeGameLevel = (e) =>
        props.changeGameLevel(e.target.value);

    const restart = () =>
        props.restartGame(props.gameLevel);

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
            <table className="center">
                <tbody>
                <tr>
                    <td>
                        <h1>Minesweeper</h1>
                    </td>
                    <td>
                        <select name="levels" id="levels" onChange={changeGameLevel}>
                            <option value="easy">Easy</option>
                            <option value="medium" selected>Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
            <p>Not Mined Cells: {props.notMinedCells}</p>
            <p> ☠️ ️ Bombs: {props.board.length - props.flaggedCells}</p>
            <Stopwatch />
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
    notMinedCells: selectNotMinedCells(state),
    flaggedCells: state.flaggedCells,
    gameLevel: state.gameLevel
});

const mapDispatchToProps = {
    restartGame,
    showAllBombs,
    changeGameLevel
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
