import { tableSelf, tableRival } from "./DOM";

const Ship = (size, axis) => {
  const shipSize = size;
  let timesHit = 0;
  let sunk = false;
  let coordinates = [];

  function getSize() {
    return shipSize;
  }

  function getAxis() {
    return axis;
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

  return { getSize, isSunk, hit, getCoordinates, setCoordinates, getAxis };
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
        arr.push({ x: j, y: i, row: i + 1, col: getColMarker(j) });
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

  function getValidCoords(shipSize) {
    const mapData = getMapData();
    const invalidCrds = getInvalidCoords();
    const spacesContainingShips = mapData.map.filter((value) => value.ship);
    const invalidArr = spacesContainingShips.concat(invalidCrds);

    function filterUniqueElements(array1, array2) {
      return array1.filter((item1) => {
        const x1 = item1.x !== undefined ? item1.x : item1[0];
        const y1 = item1.y !== undefined ? item1.y : item1[1];

        return !array2.some((item2) => {
          const x2 = item2.x !== undefined ? item2.x : item2[0];
          const y2 = item2.y !== undefined ? item2.y : item2[1];
          return x1 === x2 && y1 === y2;
        });
      });
    }

    const freeSpaceArr = filterUniqueElements(mapData.map, invalidArr);
    freeSpaceArr.sort((a, b) => a.x - b.x).sort((a, b) => a.y - b.y);

    function vertical() {
      const verticalFreeSpaceArr = mapData.getDictionary(freeSpaceArr).columns;
      const startingYPosArr = [];

      function getVerticalDiff(column, j, k) {
        if (j + k >= column.length) return false;
        const diff = difference(column[j].y, column[j + k].y);
        const log = {
          shipStart: column[j],
          shipEnd: column[j + k],
          diff,
        };
        if (diff === shipSize - 1) return { valid: true, log };
        return { valid: false };
      }

      for (let i = 0; i < verticalFreeSpaceArr.length; i += 1) {
        const column = verticalFreeSpaceArr[i];
        for (let j = 0; j < column.length; j += 1) {
          for (let k = 0; k < shipSize; k += 1) {
            if (getVerticalDiff(column, j, k).valid) {
              startingYPosArr.push(column[j]);
            }
          }
        }
      }
      return startingYPosArr;
    }

    function horizontal() {
      const startingXPosArr = [];
      function getHorizontalDiff(i, k) {
        if (i + k >= freeSpaceArr.length) return false;
        const diff = difference(freeSpaceArr[i].x, freeSpaceArr[i + k].x);
        const log = {
          shipStart: freeSpaceArr[i],
          shipEnd: freeSpaceArr[i + k],
          diff,
        };
        if (diff === shipSize - 1) return { valid: true, log };
        return { valid: false };
      }

      for (let i = 0; i < freeSpaceArr.length; i += 1) {
        for (let k = 0; k < shipSize; k += 1) {
          if (getHorizontalDiff(i, k).valid) {
            startingXPosArr.push(freeSpaceArr[i]);
          }
        }
      }

      return startingXPosArr;
    }

    // console.log({ startingXPosArr, startingYPosArr });

    return { vertical, horizontal };
  }

  function setOccupiedSpace(ship) {
    const mapData = getMapData();
    const coords = ship.getCoordinates();
    const start = coords[0];
    const end = coords[coords.length - 1];

    const adjacentOccupiedSpaceVertical = [
      [start.x, start.y - 1],
      [start.x + 1, start.y - 1],
      [start.x - 1, start.y - 1],

      [end.x, end.y + 1],
      [end.x - 1, end.y + 1],
      [end.x + 1, end.y + 1],
    ];

    const adjacentOccupiedSpaceHorizontal = [
      [start.x - 1, start.y],
      [start.x - 1, start.y + 1],
      [start.x - 1, start.y - 1],

      [end.x + 1, end.y],
      [end.x + 1, end.y + 1],
      [end.x + 1, end.y - 1],
    ];

    if (ship.axis === "y") {
      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceVertical.push([coords[j].x + 1, coords[j].y]);
        adjacentOccupiedSpaceVertical.push([coords[j].x - 1, coords[j].y]);
      }
      for (let i = 0; i < adjacentOccupiedSpaceVertical.length; i += 1) {
        const mapLocation = mapData.getCoordinateData(
          adjacentOccupiedSpaceVertical[i]
        );
        mapLocation.occupied = true;
      }
    } else if (ship.axis === "x") {
      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y + 1]);
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y - 1]);
      }
      for (let i = 0; i < adjacentOccupiedSpaceHorizontal.length; i += 1) {
        const mapLocation = mapData.getCoordinateData(
          adjacentOccupiedSpaceHorizontal[i]
        );
        mapLocation.occupied = true;
      }
    }
  }

  function placeShipPart(coords, ship) {
    const mapData = getMapData();
    const mapLocation = mapData.getCoordinateData(coords);
    if (mapLocation.ship) {
      console.log({
        mapLocation,
        shipSize: ship.getSize(),
        shipCord: ship.getCoordinates(),
      });
      throw new Error("Occupied space");
    }

    mapLocation.ship = ship;
  }

  function placeShip(coords, shipSize, axis) {
    if (axis !== "x" && axis !== "y")
      throw new Error("Ship must have a valid direction");

    if (axis === "x") {
      if (shipSize + coords[0] > size) return;
    }

    const ship = Ship(shipSize, axis);
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
      if (axis === "x") {
        if (coords[0] + shipSize <= size) {
          cordData = [coords[0] + i, coords[1]];
        }
      } else if (axis === "y") {
        if (coords[1] + shipSize <= size) {
          cordData = [coords[0], coords[1] + i];
        }
      } else {
        throw new Error("Invalid placement: Ship will not fit");
      }

      if (typeof cordData === "undefined" || cordData === null) {
        console.log({ coords, axis, shipSize });
        throw new Error("Coordinates must not be null or undefined");
      }

      placeShipPart(cordData, ship);
      pushCoordDataIntoShip(cordData);
      setOccupiedSpace(ship);
    }

    ship.setCoordinates(arrayCords);
    console.log({ arrayCords });
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

  // TODO write test that multiples the size by howMany and expect with the default board size
  // and playable ships
  // it will equal 20

  return { gameBrd, playableShips };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player();
  const rival = Player();

  function getRemainingShipsToPlace(player) {
    let count = 0;
    for (let i = 0; i < player.playableShips.length; i += 1) {
      count += player.playableShips[i].howMany;
    }
    return count;
  }

  function random(player) {
    while (getRemainingShipsToPlace(player) > 0) {
      const playableShips = player.playableShips.filter(
        (value) => value.howMany > 0
      );
      const playableShipIndex = Math.floor(
        Math.random() * playableShips.length
      );
      const shipSize = playableShips[playableShipIndex].size;

      const randAxis = Math.floor(Math.random() * 2);

      let axis;
      let validStartingPositions;

      if (randAxis === 0) {
        axis = "x";
        validStartingPositions = player.gameBrd
          .getValidCoords(shipSize)
          .horizontal();
      }
      if (randAxis === 1) {
        axis = "y";
        validStartingPositions = player.gameBrd
          .getValidCoords(shipSize)
          .vertical();
      }
      console.log({ validStartingPositions });

      const coordIndex = Math.floor(
        Math.random() * validStartingPositions.length
      );
      const target = validStartingPositions[coordIndex];
      console.log({ validStartingPositions, coordIndex });

      const log = {
        playableShips: player.playableShips,
        target,
        axis,
        shipSize,
        remainingShips: getRemainingShipsToPlace(player),
      };
      console.log(log);

      player.gameBrd.placeShip([target.x, target.y], shipSize, axis);

      playableShips[playableShipIndex].howMany -= 1;
    }
    if (getRemainingShipsToPlace(player) === 0) {
      console.log("success");
    }
  }

  random(self);
  random(rival);

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
tableSelf.update(game.self.gameBrd.getShips());
tableRival.update(game.rival.gameBrd.getShips());

export { Game, Ship };
