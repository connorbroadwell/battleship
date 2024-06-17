import { tableSelf, tableRival } from "./DOM";

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
    function getDictionary(mapArr = map) {
      const dictionary = {
        columns: [],
        rows: [],
      };
      for (let i = 0; i < size; i += 1) {
        const arrColumns = mapArr.filter(
          (value) => value.col === getColMarker(i)
        );
        dictionary.columns.push(arrColumns);

        const arrRows = mapArr.filter((value) => value.row === i + 1);
        dictionary.rows.push(arrRows);
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
      getDictionary,
    };
  }

  function getSize() {
    return size;
  }

  function allShipsSunk() {
    const mapData = getMapData();
    const ships = mapData.map.filter((value) => {
      if (value.ship) {
        return !value.ship.isSunk();
      }
      return false;
    });
    if (ships.length === 0) return true;
    return false;
  }

  function getShips() {
    const mapData = getMapData();
    return mapData.map.filter((value) => value.ship);
  }

  function difference(num1, num2) {
    return Math.abs(num1 - num2);
  }

  function getValidCoords(axis, shipSize) {
    const mapData = getMapData();
    const freeSpace = mapData.map.filter((value) => !value.ship);
    const validStartingPositions = [];
    let dictionary;

    function getColumns() {
      return mapData.getDictionary(freeSpace).columns;
    }

    function getRows() {
      return mapData.getDictionary(freeSpace).rows;
    }

    function getColumnData(columnData) {
      if (axis === "x") return columnData.x;
      if (axis === "y") return columnData.y;
      return null;
    }

    if (axis === "x") {
      dictionary = getColumns();
    } else if (axis === "y") {
      dictionary = getRows();
    }

    for (let i = 0; i < dictionary.length; i += 1) {
      const column = dictionary[i];

      for (let j = 0; j < column.length; j += 1) {
        for (let k = 0; k < shipSize; k += 1) {
          if (j + k < column.length) {
            const diff = difference(
              getColumnData(column[j]),
              getColumnData(column[j + k])
            );
            console.log({ test: column[j], test2: column[j + k], diff });
            if (diff === shipSize - 1) {
              validStartingPositions.push(column[j]);
            }
          }
        }
      }
    }
    return validStartingPositions;
  }

  function placeShipPart(coords, ship) {
    const mapData = getMapData();
    const mapLocation = mapData.getCoordinateData(coords);
    if (mapLocation.ship) return "occupied";

    mapLocation.ship = ship;
  }

  function placeShip(coords, shipSize, direction) {
    if (
      direction !== "horizontal" &&
      direction !== "vertical" &&
      direction !== "x" &&
      direction !== "y"
    )
      throw new Error("Ship must have a direction");

    const ship = Ship(shipSize);
    const arrayCords = [];
    const mapData = getMapData();
    let cordData;

    function pushCoordDataIntoShip(data) {
      const mapCoordsClone = JSON.parse(
        JSON.stringify(mapData.getCoordinateData(data))
      );
      delete mapCoordsClone.ship;
      arrayCords.push(mapCoordsClone);
    }

    for (let i = 0; i < shipSize; i += 1) {
      if (direction === "horizontal" || direction === "x") {
        if (coords[0] + shipSize <= size) {
          cordData = [coords[0] + i, coords[1]];
        }
      } else if (direction === "vertical" || direction === "y") {
        if (coords[1] + shipSize <= size) {
          cordData = [coords[0], coords[1] + i];
        }
      } else {
        throw new Error("Invalid placement: Ship will not fit");
      }

      if (typeof cordData === "undefined" || cordData === null)
        throw new Error("Coordinates must not be null or undefined");

      placeShipPart(cordData, ship);
      pushCoordDataIntoShip(cordData);
    }

    ship.setCoordinates(arrayCords);
  }

  function receiveAttack(coords) {
    const mapData = getMapData();
    const target = mapData.getCoordinateData(coords);
    if (target.miss || target.hit) return;
    if (target.ship) {
      if (target.ship.isSunk()) return;
      target.ship.hit();
      target.hit = true;
    } else {
      target.miss = true;
    }
  }

  return {
    getSize,
    placeShip,
    placeShipPart,
    allShipsSunk,
    receiveAttack,
    getMapData,
    getValidCoords,
    getShips,
  };
};

const Player = () => {
  const gameBrd = Gameboard();
  const playableShips = [
    { size: 1, howMany: 4 },
    { size: 2, howMany: 3 },
    { size: 3, howMany: 2 },
    { size: 4, howMany: 1 },
  ];

  return { gameBrd, playableShips };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player();
  const rival = Player();

  function getRemainingShips(player) {
    let count = 0;
    for (let i = 0; i < player.playableShips.length; i += 1) {
      count += player.playableShips[i].howMany;
    }
    return count;
  }

  function random(player) {
    while (getRemainingShips(player) > 0) {
      const playableShips = player.playableShips.filter(
        (value) => value.howMany > 0
      );
      const playableShipIndex = Math.floor(
        Math.random() * playableShips.length
      );
      const randAxis = Math.floor(Math.random() * 2);
      const shipSize = playableShips[playableShipIndex].size;
      let axis;
      if (randAxis === 0) {
        axis = "x";
      }
      if (randAxis === 1) {
        axis = "y";
      }

      const validStartingPositionsH = player.gameBrd.getValidCoords(
        "x",
        shipSize
      );
      const validStartingPositionsV = player.gameBrd.getValidCoords(
        "y",
        shipSize
      );

      const validStartingPos = validStartingPositionsH.filter((space) =>
        validStartingPositionsV.includes(space)
      );
      // console.log(validStartingPos);
      const coordIndex = Math.floor(Math.random() * validStartingPos.length);
      const target = validStartingPos[coordIndex];
      const log = {
        playableShips: player.playableShips,
        target,
        axis,
        shipSize,
        remainingShips: getRemainingShips(player),
      };
      // console.log(log);
      if (
        player.gameBrd.placeShip([target.x, target.y], shipSize, axis) ===
        "occupied"
      ) {
        let axz;
        if (axis === "x") axz = "y";
        if (axis === "y") axz = "x";
        player.gameBrd.placeShip([target.x, target.y], shipSize, axz);
      }
      playableShips[playableShipIndex].howMany -= 1;
    }
  }

  random(self);
  tableSelf.update(self.gameBrd.getShips());

  function getPlayableShips() {
    const total = playableShips.reduce(
      // eslint-disable-next-line no-return-assign, no-param-reassign
      (prev, cur) => (cur.howMany += prev.howMany)
    );

    return { playableShips, total };
  }

  return { getPlayableShips, self, rival };
};

const game = Game();

export { Game, Ship };
