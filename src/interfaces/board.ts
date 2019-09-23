export interface IBoardState {
  tiles: ITile[];
  gameover: boolean;
}

export interface IBoardProps {
  getReset: (reset: () => void) => void;
  gameOver: (won: boolean) => void;
  amountOfBombs: number;
}

export interface ITile {
  id: number;
  neighbors: number[];
  noOfBombs?: number;
  hasBomb: boolean
  flagged: boolean;
}
