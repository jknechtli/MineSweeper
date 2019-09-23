
import './Game.css';

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Modal from '../modal/Modal';
import HoneySweeper from '../honeySweeper/HoneySweeper';
import MineSweeper from '../mineSweeper/MineSweeper';

interface IGameState {
  usingHoney: boolean;
  amountOfBombs: number;
  showModal: boolean;
  seconds: number;
  gameover: boolean;
  won: boolean;
  boardReset?: () => void;
}

class Game extends React.Component<RouteComponentProps<{}>, IGameState> {
  public state: IGameState = {
    usingHoney: false,
    amountOfBombs: 10,
    seconds: 0,
    showModal: false,
    gameover: false,
    won: false
  };

  public componentDidMount() {
    this.reset();
  }

  public render() {
    const { showModal, amountOfBombs, usingHoney, gameover, seconds, won } = this.state;

    return (
      <div className="game">
        <div className="page-content">
          {won ? (
            <Modal onClose={this.closeModal} title="WINNER" show={showModal}>
              You won. <br />
              Score: {seconds}
            </Modal>
          ) : (
              <Modal onClose={this.closeModal} title="BOOOMMM!!!!" show={showModal}>
                Game over. <br />
                Score: {seconds}
              </Modal>
            )}
          {gameover ? <div className="gameover"></div> : null}
          <div className="controls">
            <button id="reset" onClick={this.reset}>
              Reset
            </button>
            <label htmlFor="amountOfBombs">Bombs:</label>
            <input
              type="text"
              name="amountOfBombs"
              value={amountOfBombs + ''}
              onChange={this.updateBombs}
            />
            <label htmlFor="seconds" id="lblSeconds">
              Seconds:
            </label>
            <label id="seconds">{seconds}</label>
            <div className="btn-group">
              <button onClick={this.changeUsing} className={`btn ${!usingHoney ? 'active' : ''}`}>Mine Field</button>
              <button onClick={this.changeUsing} className={`btn ${usingHoney ? 'active' : ''}`}>Honey Comb</button>
            </div>
          </div>
          <div className="board">
            {
              usingHoney ?
                <HoneySweeper getReset={this.getReset} gameOver={this.gameOver} amountOfBombs={amountOfBombs} {...this.props} />
                :
                <MineSweeper getReset={this.getReset} gameOver={this.gameOver} amountOfBombs={amountOfBombs}{...this.props} />
            }
          </div>
        </div>
      </div>
    );
  }

  private changeUsing = () => {
    this.setState({ usingHoney: !this.state.usingHoney });
  }

  private gameOver = (won: boolean) => {
    this.setState({ showModal: true, won, gameover: !won });
  }

  private getReset = (boardReset: () => void) => {
    this.setState({ boardReset })
  }

  private reset = async () => {
    if (this.state.boardReset) {
      this.state.boardReset()
    }

    await this.setState({ seconds: 0, gameover: false });
    this.startTimer();
  };

  private updateBombs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({ amountOfBombs: parseInt(value) });
    this.reset();
  };

  private closeModal = () => {
    this.setState({ showModal: false });
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

export default Game;
