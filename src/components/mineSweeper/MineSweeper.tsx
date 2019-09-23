import './MineSweeper.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IBoardProps, IBoardState, ITile } from '../../interfaces/board';

class MineSweeper extends React.Component<RouteComponentProps<{}> & IBoardProps, IBoardState> {
  public state: IBoardState = {
    tiles: [],
    gameover: false,
  };

  public componentDidMount() {
    if (this.props.getReset) {
      this.props.getReset(this.reset);
    }
    this.createTiles()
      .then(this.reset);
  }

  public render() {
    const { tiles } = this.state;

    return (
      <div className="mine-sweeper">
        {
          tiles.map(tile =>
            <button
              key={tile.id}
              name={tile.id + ''}
              className={`tile ${tile.flagged ? 'flag' : ''} ${
                tile.noOfBombs === undefined ? 'unseen' : ''
                }`}
              onContextMenu={this.flag}
              onClick={this.click}
            >
              {tile.noOfBombs !== undefined && tile.noOfBombs !== 0 ? tile.noOfBombs : '-'}
            </button>
          )
        }
      </div>
    );
  }

  private click = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { tiles, gameover } = this.state;
    const clickedIndex = parseInt((event.target as any).name);

    if (tiles[clickedIndex].flagged || gameover) {
      return;
    }
    if (tiles[clickedIndex].hasBomb) {
      this.setState({ gameover: true });
      this.props.gameOver(false)
      return;
    }

    const FIFO = [clickedIndex];
    let j = 0;
    while (FIFO.length > j) {
      const cIndex = FIFO[j];
      let bombCount = 0

      // console.log(cIndex, tiles[cIndex])
      tiles[cIndex].neighbors.forEach(neighbor => {
        // console.log(neighbor)
        if (tiles[neighbor].hasBomb) {
          bombCount++;
        }
      })

      tiles[cIndex].noOfBombs = bombCount;

      if (bombCount === 0) {
        tiles[cIndex].neighbors.forEach(index => {
          if (index >= 0 && index < 100 && !FIFO.some(FIFOi => FIFOi === index)) {
            FIFO.push(index);
          }
        });
      }
      j++;
    }
    this.setState({ tiles });
  };

  private flag = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { tiles } = this.state;
    event.preventDefault();
    const clickedIndex = (event.target as any).name;

    if (tiles[clickedIndex].noOfBombs === undefined) {
      tiles[clickedIndex].noOfBombs = -1;
      tiles[clickedIndex].flagged = true;
    } else if (tiles[clickedIndex].noOfBombs === -1) {
      tiles[clickedIndex].noOfBombs = undefined as any;
      tiles[clickedIndex].flagged = false;
    }

    const won = !tiles.some(tile => {
      if (tile.hasBomb && !tile.flagged) {
        return true;
      }
      return false;
    });

    if (won) {
      this.props.gameOver(true);
    }

    this.setState({ tiles, gameover: won });
  };

  private reset = async () => {
    const { tiles } = this.state;
    const { amountOfBombs } = this.props;

    let bombCount = 0;

    tiles.forEach(t => {
      t.hasBomb = false;
      t.noOfBombs = undefined;
    })

    while (bombCount < amountOfBombs) {
      const bomb = Math.floor(Math.random() * 99);

      if (!tiles[bomb].hasBomb) {
        tiles[bomb].hasBomb = true;
        bombCount++;
      }
    }
    await this.setState({ tiles, gameover: false });
  };

  private createTiles = async () => {
    const tiles: ITile[] = [];

    for (let index = 0; index < 100; index++) {

      const tile: ITile = {
        flagged: false,
        hasBomb: false,
        id: index,
        neighbors: [],
      }

      for (let i = 0; i < 9; i++) {
        if (i === 4) continue;

        const side = 10;

        const prt1 = (side + 1) * -1;
        const prt2 = Math.floor(i / 3) * side;
        const prt3 = i % 3;
        const nIndex = index + prt1 + prt2 + prt3;


        if (
          (index % 10 === 0 && (nIndex + 1) % 10 === 0) ||
          ((index + 1) % 10 === 0 && nIndex % 10 === 0)
        ) {
          continue;
        }

        if (nIndex >= 0 && nIndex < 100) {
          tile.neighbors.push(nIndex);
        }
      }
      tiles.push(tile);
    }

    await this.setState({ tiles });
  };
}

export default MineSweeper;
