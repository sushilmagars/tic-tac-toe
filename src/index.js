import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { stat } from 'fs';
import Board from './Board';
import { debug } from 'util';
import ErrorMessage from './ErrorMessage';

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
      errorMessage: '',
    }
  }

  setPlayerToken(event, isPlayerOne) {
    const newToken  = event.target.value;
    
    // if use did not enter any token, do not update default tokens
    if (!newToken) {
      return;
    }
    
    const currentToken = isPlayerOne ? this.state.playerOneToken : this.state.playerTwoToken;

    let validationError;

    if ((isPlayerOne && newToken === this.state.playerTwoToken) || newToken === this.state.playerOneToken) {
      validationError = `Both players cannot have same token!`

      this.setState({
        errorMessage: validationError,
      });

      return;
    }

    if (this.state.errorMessage) {
      this.setState({
        errorMessage: ''
      });
    }

    let currentPlayerOneToken = this.state.playerOneToken;
    let currentPlayerTwoToken = this.state.playerTwoToken;

    // get the history of moves and current moves
    let history = this.state.history.slice();
    let current = history[history.length - 1].squares.slice();

    current.forEach((value, key) => {
      if (value === currentToken) {
        current[key] = newToken;
      }
    });

    history[history.length - 1] = {squares: current};

    // set player token for appropriate player
    if (isPlayerOne) {
      currentPlayerOneToken = newToken;
    } else {
      currentPlayerTwoToken = newToken;
    }

    this.setState({
      history: history,
      playerOneToken: currentPlayerOneToken,
      playerTwoToken: currentPlayerTwoToken
    });
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
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let newSquares = history[history.length - 1].squares.slice();

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
    this.setState({
      stepNumber: step,
      playerOneIsNext: (step % 2) === 0,
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber];
    const winner = this.getWinner(current.squares);
    let status;

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
        <div className="set-player-tokens">
          <label>Enter player 1 token:
            <input 
              className="player-token"
              onBlur={(event) => this.setPlayerToken(event, true)}
            />
          </label>
          <label>Enter player 2 token:
            <input 
              className="player-token"
              onBlur={(event) => this.setPlayerToken(event, false)}
            />
          </label>
          <ErrorMessage message={this.state.errorMessage} />
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
