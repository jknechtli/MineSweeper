import './MineSweeper.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IProps {
  getReset: (reset: () => void) => void;
  gameOver: (won: boolean) => void;
  amountOfBombs: number;
}

interface IState {
  board: number[]; // -1 == flag | undfined
  bombs: boolean[]; // same size as board
  gameover: boolean;
}

class MineSweeper extends React.Component<RouteComponentProps<{}> & IProps, IState> {
  public state: IState = {
    board: [],
    bombs: [],
    gameover: false,
  };

  public componentDidMount() {
    this.reset();
  }

  public render() {
    const { board } = this.state;

    return (
      <div className="mine-sweeper">
        {(() => {
          const elements = [];
          for (let i = 0; i < 100; i++) {
            elements.push(
              <button
                key={i}
                name={i + ''}
                className={`tile ${board[i] === -1 ? 'flag' : ''} ${
                  board[i] === undefined ? 'unseen' : ''
                  }`}
                onContextMenu={this.flag}
                onClick={this.click}
              >
                {board[i] !== undefined && board[i] !== 0 ? board[i] : '-'}
              </button>
            );
          }
          return elements;
        })()}
      </div>
    );
  }

  private click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { board, bombs, gameover } = this.state;
    const clickedIndex = parseInt((event.target as any).name);

    if (board[clickedIndex] === -1 || gameover) {
      return;
    }
    if (bombs[clickedIndex]) {
      this.setState({ gameover: true });
      return;
    }

    const FIFO = [clickedIndex];
    let j = 0;
    while (FIFO.length > j) {
      const cIndex = FIFO[j];

      const { bombCount, indexes } = this.numberOfBombsInTheNeighborhood(cIndex);
      board[cIndex] = bombCount;

      if (bombCount === 0) {
        indexes.forEach(index => {
          if (index >= 0 && index < 100 && !FIFO.some(FIFOi => FIFOi === index)) {
            FIFO.push(index);
          }
        });
      }
      j++;
    }
    this.setState({ board });
  };

  private flag = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { board, bombs } = this.state;
    event.preventDefault();
    const clickedIndex = (event.target as any).name;

    if (board[clickedIndex] === undefined) {
      board[clickedIndex] = -1;
    } else if (board[clickedIndex] === -1) {
      board[clickedIndex] = undefined as any;
    }

    const won = !bombs.some((b, i) => {
      if (b && board[i] !== -1) {
        return true;
      }
      return false;
    });
    if (won) {
      this.props.gameOver(true);
    }

    this.setState({ board, gameover: won });
  };

  private reset = async () => {
    const { amountOfBombs } = this.props;

    const bombs: boolean[] = [];
    let bombCount = 0;

    while (bombCount < amountOfBombs) {
      const bomb = Math.floor(Math.random() * 99);

      if (!bombs[bomb]) {
        bombs[bomb] = true;
        bombCount++;
      }
    }
    await this.setState({ bombs, board: [], gameover: false });
  };

  private numberOfBombsInTheNeighborhood = (index: number) => {
    const { bombs } = this.state;
    let bombCount = 0;
    const indexes = [];

    for (let i = 0; i < 9; i++) {
      if (i === 4) continue;

      const side = 10;

      const prt1 = (side + 1) * -1;
      const prt2 = Math.floor(i / 3) * side;
      const prt3 = i % 3;
      const nIndex = index + prt1 + prt2 + prt3;

      if (
        // this is to check if the index is on the edge and the neighbor is on the other side of the board
        (index % 10 === 0 && (nIndex + 1) % 10 === 0) ||
        ((index + 1) % 10 === 0 && nIndex % 10 === 0)
      ) {
        continue;
      }

      indexes.push(nIndex);

      if (bombs[nIndex]) {
        bombCount++;
      }
    }

    return { bombCount, indexes };
  };
}

export default MineSweeper;
