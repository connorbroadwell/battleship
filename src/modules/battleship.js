const Ship = () => {};

const Gameboard = () => {
  let size = 10;

  function setSize(numSize) {
    size = numSize;
  }

  function getSize() {
    return size;
  }

  return { setSize, getSize };
};

const Player = () => {
  const gameBrd = Gameboard();

  return { gameBrd };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player();
  const rival = Player();

  const playableShips = {
    oneShip: 4,
    twoShip: 3,
    threeShip: 2,
    fourShip: 1,
  };

  function getPlayableShips() {
    const total = Object.values(playableShips).reduce(
      (prev, cur) => (cur += prev)
    );

    return { playableShips, total };
  }

  return { getPlayableShips, self, rival };
};

export { Game };
