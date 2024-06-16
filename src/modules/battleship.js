const Ship = (size) => {
  const shipSize = size;
  let timesHit = 0;
  let sunk = false;
  let coordinates = [];

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

  const map = init();

  function getMapData() {
    function getDictionary() {
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

    function getIndexByCoordinate(coords) {
      const result = map.findIndex(
        (value) => value.x === coords[0] && value.y === coords[1]
      );
      return result;
    }

    function getCoordinateByIndex(index) {
      return map[index];
    }

    function getCoordinateData(coords) {
      const index = getIndexByCoordinate(coords);
      return getCoordinateByIndex(index);
    }

    return {
      getCoordinateData,
      map,
    };
  }

  function getSize() {
    return size;
  }

  function getAliveShips() {
    const mapData = getMapData();
    return mapData.map.filter((value) => value.ship);
  }

  function placeShipPart(coords, ship) {
    const mapData = getMapData();
    const mapLocation = mapData.getCoordinateData(coords);
    if (mapLocation.ship) throw new Error("Occupied space!");

    mapLocation.ship = ship;
  }

  function placeShip(coords, shipSize, direction) {
    if (direction !== "horizontal" && direction !== "vertical")
      throw new Error("Ship must have a direction");
    const ship = Ship(shipSize);
    const arrayCords = [];
    const mapData = getMapData();
    for (let i = 0; i < shipSize; i += 1) {
      if (direction === "horizontal" && coords[0] + shipSize < size) {
        const hCords = [coords[0] + i, coords[1]];
        placeShipPart(hCords, ship);
        const mapCoordsClone = JSON.parse(
          JSON.stringify(mapData.getCoordinateData(hCords))
        );
        delete mapCoordsClone.ship;
        arrayCords.push(mapCoordsClone);
      } else if (direction === "vertical" && coords[1] + shipSize < size) {
        const vCords = [coords[0], coords[1] + i];
        placeShipPart(vCords, ship);
        const mapCoordsClone = JSON.parse(
          JSON.stringify(mapData.getCoordinateData(vCords))
        );
        delete mapCoordsClone.ship;
        arrayCords.push(mapCoordsClone);
      } else {
        throw new Error("Invalid placement: Ship will not fit");
      }
    }
    ship.setCoordinates(arrayCords);
  }

  function receiveAttack(coords) {
    const mapData = getMapData();
    const target = mapData.getCoordinateData(coords);
    if (target.miss) return;
    if (target.ship) {
      if (target.ship.isSunk()) return;
      target.ship.hit();
    } else {
      target.miss = true;
    }
  }

  return {
    getSize,
    placeShip,
    placeShipPart,
    getAliveShips,
    receiveAttack,
    getMapData,
  };
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

export { Game, Ship };
