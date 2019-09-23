import './HoneySweeper.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { IBoardProps, IBoardState, ITile } from '../../interfaces/board';

class HoneySweeper extends React.Component<RouteComponentProps<{}> & IBoardProps, IBoardState> {
  public state: IBoardState = {
    tiles: [],
    gameover: false
  };

  public componentDidMount() {
    if (this.props.getReset) {
      this.props.getReset(this.reset);
    }
    this.createTiles()
      .then(this.reset);
  }

  public render() {
    // const { board, showModal, amountOfBombs, gameover, seconds, won } = this.state;
    const { tiles } = this.state;

    return (
      <div className="honey-sweeper">

        <ul id="grid" className="clear">
          {
            tiles.map(t => {
              const thing = () => this.click(t.id)
              const flagging = (event: any) => {
                event.preventDefault();
                this.flag(t.id)
              }
              const revealed = t.noOfBombs !== undefined && t.noOfBombs >= 0;
              return (<li key={t.id}>
                <button className={`hexagon ${revealed ? 'revealed' : ''}`} onContextMenu={flagging} name={'' + t.id} onClick={thing}>
                  <h1 className={t.flagged ? 'flagged' : ''}>
                    {t.noOfBombs}
                  </h1>
                </button>
              </li>);
            })
          }
        </ul>
      </div>
    );
  }

  private createTiles = async () => {
    const tiles: ITile[] = []

    for (let i = 0; i < 63; i++) {
      const tile: ITile = {
        hasBomb: false,
        id: i,
        neighbors: [],
        flagged: false,
        noOfBombs: undefined
      }

      const adjust = (i % 14) < 7 ? 1 : 0;
      const isTop = i < 7;
      const isBottom = i > 55;
      const isLongLeft = (i % 14) === 0;
      const isShortLeft = !isLongLeft && ((i % 7) === 0);
      const isLongRight = ((i + 1) % 14) === 0;
      const isShortRight = !isLongRight && (((i + 1) % 7) === 0);

      // console.log(` ${i} is: ${isTop ? 'isTop' : ''} ${isBottom ? 'isBottom' : ''} ${isLongLeft ? 'isLongLeft' : ''} ${isShortLeft ? 'isShortLeft' : ''} ${isLongRight ? 'isLongRight' : ''} ${isShortRight ? 'isShortRight' : ''}`)

      if (!isTop) {
        if (!isLongLeft) {
          tile.neighbors.push(i - (7 + adjust));
        }
        if (!isLongRight) {
          tile.neighbors.push(i - (6 + adjust));
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
          tile.neighbors.push(i + (7 - adjust));
        }
        if (!isLongRight) {
          tile.neighbors.push(i + (8 - adjust));
        }
      }

      tiles.push(tile);
    }

    await this.setState({ tiles });
  }

  private click = (id: number) => {
    const { tiles, gameover } = this.state

    if (tiles[id].flagged || gameover) {
      return;
    }
    if (tiles[id].hasBomb) {
      this.setState({ gameover: true });
      this.props.gameOver(false)
      return;
    }

    const FIFO = [id];
    let j = 0;
    while (FIFO.length > j) {
      const cIndex = FIFO[j];

      let bombCount = 0

      tiles[cIndex].neighbors.forEach(neighbor => {
        if (tiles[neighbor].hasBomb) {
          bombCount++;
        }
      })

      // const { bombCount, indexes } = this.numberOfBombsInTheNeighborhood(cIndex);
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

  private flag = (id: number) => {
    const { tiles } = this.state;

    if (tiles[id].noOfBombs === undefined) {
      tiles[id].noOfBombs = -1;
      tiles[id].flagged = true;
    } else if (tiles[id].noOfBombs === -1) {
      tiles[id].noOfBombs = undefined as any;
      tiles[id].flagged = false;
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
      const bomb = Math.floor(Math.random() * 61);

      if (!tiles[bomb].hasBomb) {
        tiles[bomb].hasBomb = true;
        bombCount++;
      }
    }
    await this.setState({ gameover: false, tiles });
  };
}

export default HoneySweeper;
