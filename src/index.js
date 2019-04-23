import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { stat } from 'fs';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: new Array(9).fill(null),
      playerOneIsNext: true,
      playerOneToken: 'X',
      playerTwoToken: 'O'
    };
  }

  handleClick(i) {
    const newSquares = this.state.squares.slice();
    if (this.getWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = this.state.playerOneIsNext ? this.state.playerOneToken : this.state.playerTwoToken;

    this.setState({
      squares: newSquares,
      playerOneIsNext: !this.state.playerOneIsNext
    });
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
      />;
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

  setPlayerToken(e) {

  }

  render() {
    const winner = this.getWinner(this.state.squares);
    let status;

    if (winner) {
      status = `Winner found: ${winner}`;
    } else {
      status = this.state.playerOneIsNext ? this.state.playerOneToken : this.state.playerTwoToken;
    }

    return (
      <div>
        <div className="status">Turn player: {status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function SetPlayer(props) {
  return (
    <input value={props.playerToken}></input>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneToken: 'X',
      playerTwoToken: 'O'
    }
  }

  handlePlayerTokenChange(newToken) {

  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <label className="set-player-token"> Set player 1: 
            <SetPlayer 
              playerToken={this.state.playerOneToken}
              onPlayerTokenChange={() => this.handlePlayerTokenChange()}
              />
          </label>
          <label className="set-player-token"> Set player 2: 
            <SetPlayer playerToken={this.state.playerTwoToken} /></label>
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
