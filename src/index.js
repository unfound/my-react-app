import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Square (props) {
  return (
    <button className={`square ${props.highlight && 'highlight'}`} onClick={ props.onClick }>
      { props.value }
    </button>
  )
}

class Board extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    }
  }

  renderSquare(i, key, lines) {
    return (
      <Square
        value={this.props.squares[i]}
        key={ key }
        highlight={ lines && lines.includes(i) }
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  renderBoard (n) {
    let numberList = new Array(n).fill(0).map((val, key) => key)
    let dom = numberList.map(i => {
      return (
        <div className="board-row" key={ i }>
          {
            numberList.map(j => {
              return this.renderSquare(i * n + j, i * n + j, this.props.winnerLines)
            })
          }
        </div>
      )
    })
    return dom
  }

  render() {
    return (
      <div>
        { this.renderBoard(3) }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        x: -1,
        y: -1
      }],
      stepNumber: 0,
      xIsNext: true,
      stepSort: 'up'
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) return
    squares[i] = this.state.xIsNext ? '×' : 'o'
    const x = i % 3
    const y = Math.floor(i / 3)
    this.setState({
      history: history.concat([{
        squares,
        x,
        y
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  changeSort () {
    this.setState({
      stepSort: this.state.stepSort === 'up' ? 'down' : 'up'
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move} className={move === this.state.stepNumber ? 'active' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {
            step.x >= 0 && <span>({step.x}, {step.y})</span>
          }
        </li>
      )
    })
    if (this.state.stepSort === 'down') {
      moves.reverse()
    }
    let status
    if (winner && winner !== -1) {
      status = 'Winnner: ' + winner[0]
    } else if (winner === -1) {
      status = '平局'
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? '×' : 'o')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = { current.squares }
            winnerLines = { Array.isArray(winner) && winner[1] }
            onClick = { i => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={ () => this.changeSort() }>变更排序</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]]
    }
  }
  if (squares.every(item => item !== null)) {
    return -1
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
