const Ship = (size) => {
  const shipSize = size;
  let timesHit = 0;
  let sunk = false;
  let coordinates;

  function getSize() {
    return shipSize;
  }

  function hit() {
    timesHit += 1;
  }

  function isSunk() {
    if (timesHit === shipSize) {
      sunk = true;
    }
    return sunk;
  }

  function getCoordinates() {
    return coordinates;
  }

  function setCoordinates(cords) {
    coordinates = cords;
  }

  return { getSize, isSunk, hit, getCoordinates, setCoordinates };
};

const Gameboard = () => {
  const size = 10;

  function getColMarker(yPos) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const arr = alphabet.split("");
    return arr[yPos];
  }

  function init() {
    const arr = [];
    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        arr.push({ x: i, y: j, row: i + 1, col: getColMarker(j) });
      }
    }
    return arr;
  }

  function getMap() {
    const map = init();
    const dictionary = {
      columns: {},
      rows: {},
    };
    for (let i = 0; i < size; i += 1) {
      const arrColumns = map.filter((value) => value.col === getColMarker(i));
      dictionary.columns[getColMarker(i)] = arrColumns;

      const arrRows = map.filter((value) => value.row === i + 1);
      dictionary.rows[i + 1] = arrRows;
    }

    return dictionary;
  }

  const map = getMap();

  function getSize() {
    return size;
  }

  function placeShip(coords) {}

  return { getSize };
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
      // eslint-disable-next-line no-return-assign, no-param-reassign
      (prev, cur) => (cur += prev)
    );

    return { playableShips, total };
  }

  return { getPlayableShips, self, rival };
};

export { Game };
