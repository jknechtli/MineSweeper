import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MineSweeper from './components/mineSweeper/MineSweeper';
import HoneySweeper from './components/honeySweeper/HoneySweeper';
import Game from './components/game/Game';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={Game} />
          <Route exact={true} path="/honey" component={HoneySweeper} />
          <Route exact={true} path="/mine" component={MineSweeper} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
