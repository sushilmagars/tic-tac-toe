import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { stat } from 'fs';
import Board from './Board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: new Array(9).fill(null)}
      ],
      playerOneToken: 'X',
      playerTwoToken: 'O',
      playerOneIsNext: true,
      stepNumber: 0,
    }
  }

  getWinner(squares) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [idx1, idx2, idx3] = winningCombinations[i];

      if (squares[idx1] && squares[idx1] === squares[idx2] && squares[idx1] === squares[idx3]) {
        return squares[idx1];
      }
    }

    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const newSquares = history[history.length - 1].squares.slice();

    if (this.getWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = this.state.playerOneIsNext ? this.state.playerOneToken : this.state.playerTwoToken;

    this.setState({
      history: history.concat([{
        squares: newSquares,
      }]),
      stepNumber: history.length,
      playerOneIsNext: !this.state.playerOneIsNext
    });
  }

  jumpToMove(step) {
    debugger
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];

    let status;
    const winner = this.getWinner(current.squares);

    if (winner) {
      status = `Winner found: ${winner}`;
    } else {
      status = this.state.playerOneIsNext ? this.state.playerOneToken : this.state.playerTwoToken;
    }

    const moves = this.state.history.map((value, move) => {
      const description = move ? `Go to move # ${move}` : `Go to start`;

      return (
        <li key={move}>
          <button onClick={() => this.jumpToMove(move)}>{description}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            playerOneToken={this.state.playerOneToken}
            playerTwoToken={this.state.playerTwoToken}
            onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>Next player to play: {status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
