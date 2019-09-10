import './HoneySweeper.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface ITile {
  id: number;
  neighbors: number[];
  noOfBombs?: number;
  hasBomb: boolean
}

interface IState {
  tiles: ITile[];

  board: number[]; // -1 == flag | undfined
  bombs: boolean[]; // same size as board
  amountOfBombs: number;
  showModal: boolean;
  seconds: number;
  gameover: boolean;
  won: boolean;
}

class HoneySweeper extends React.Component<RouteComponentProps<{}>, IState> {
  public state: IState = {
    tiles: [],
    board: [],
    bombs: [],
    amountOfBombs: 10,
    seconds: 0,
    showModal: false,
    gameover: false,
    won: false
  };

  public componentDidMount() {
    this.createTiles();
  }

  public render() {
    // const { board, showModal, amountOfBombs, gameover, seconds, won } = this.state;
    const { tiles } = this.state;

    return (
      <div className="honey-sweeper">

        <ul id="grid" className="clear">
          {
            tiles.map(t =>
              <li key={t.id}>
                <button className="hexagon" onClick={this.click}>{t.id}</button>
              </li>)
          }
        </ul>
      </div>
    );
  }

  private createTiles = () => {
    const tiles: ITile[] = []

    for (let i = 0; i < 63; i++) {
      const tile: ITile = {
        hasBomb: false,
        id: i,
        neighbors: [],
        noOfBombs: undefined
      }

      const isTop = i < 7;
      const isBottom = i > 55;
      const isLongLeft = (i % 14) === 0;
      const isShortLeft = !isLongLeft && (((i + 1) % 7) === 0);
      const isLongRight = ((i + 1) % 14) === 0;
      const isShortRight = !isLongRight && (((i + 1) % 7) === 0);

      if (!isTop) {
        if (!isLongLeft) {
          tile.neighbors.push(i - 6);
        }
        if (!isLongRight) {
          tile.neighbors.push(i - 7);
        }
      }

      if (!isLongLeft && !isShortLeft) {
        tile.neighbors.push(i - 1);
      }
      if (!isLongRight && !isShortRight) {
        tile.neighbors.push(i + 1);
      }

      if (!isBottom) {
        if (!isLongLeft) {
          tile.neighbors.push(i + 7);
        }
        if (!isLongRight) {
          tile.neighbors.push(i + 8);
        }
      }

      tiles.push(tile);
    }

    this.setState({ tiles });
  }

  private click = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
    console.log(event.target)
    // const { board, bombs, gameover } = this.state;
    // const clickedIndex = parseInt((event.target as any).name);

    // if (board[clickedIndex] === -1 || gameover) {
    //   return;
    // }
    // if (bombs[clickedIndex]) {
    //   this.setState({ showModal: true, gameover: true });
    //   return;
    // }

    // const FIFO = [clickedIndex];
    // let j = 0;
    // while (FIFO.length > j) {
    //   const cIndex = FIFO[j];

    //   const { bombCount, indexes } = this.numberOfBombsInTheNeighborhood(cIndex);
    //   board[cIndex] = bombCount;

    //   if (bombCount === 0) {
    //     indexes.forEach(index => {
    //       if (index >= 0 && index < 100 && !FIFO.some(FIFOi => FIFOi === index)) {
    //         FIFO.push(index);
    //       }
    //     });
    //   }
    //   j++;
    // }
    // this.setState({ board });
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

    this.setState({ board, won, showModal: won });
  };

  private reset = async () => {
    const { amountOfBombs } = this.state;

    const bombs: boolean[] = [];
    let bombCount = 0;

    while (bombCount < amountOfBombs) {
      const bomb = Math.floor(Math.random() * 99);

      if (!bombs[bomb]) {
        bombs[bomb] = true;
        bombCount++;
      }
    }
    await this.setState({ bombs, board: [], seconds: 0, gameover: false });
    this.startTimer();
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

  private closeModal = () => {
    this.setState({ showModal: false });
  };

  private updateBombs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ amountOfBombs: parseInt(value) });
    this.reset();
  };

  private startTimer = async () => {
    let { seconds } = this.state;
    while (true) {
      await this.delay();
      seconds++;
      if (this.state.showModal || this.state.gameover || this.state.seconds + 1 !== seconds) {
        seconds = 0;
        return;
      }
      this.setState({ seconds });
    }
  };

  private delay = async () => {
    return new Promise(r => {
      setTimeout(r, 1000);
    });
  };

}

export default HoneySweeper;
