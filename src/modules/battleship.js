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

  function getInvalidCoords() {
    const mapData = getMapData();
    const invalidCoords = [];

    function push(adjacentSpace) {
      if (
        invalidCoords.some(
          (subArr) =>
            JSON.stringify(subArr) ===
            JSON.stringify([adjacentSpace[0], adjacentSpace[1]])
        )
      ) {
        return;
      }
      invalidCoords.push([adjacentSpace[0], adjacentSpace[1]]);
    }

    function getHorizontal(coords) {
      for (let j = 0; j < coords.length; j += 1) {
        push([coords[j].x, coords[j].y + 1]);
        push([coords[j].x, coords[j].y - 1]);
      }
      const start = coords[0];
      const end = coords[coords.length - 1];
      push([start.x - 1, start.y]);
      push([start.x - 1, start.y + 1]);
      push([start.x - 1, start.y - 1]);

      push([end.x + 1, end.y]);
      push([end.x + 1, end.y + 1]);
      push([end.x + 1, end.y - 1]);
    }

    function getVertical(coords) {
      for (let j = 0; j < coords.length; j += 1) {
        push([coords[j].x + 1, coords[j].y]);
        push([coords[j].x - 1, coords[j].y]);
      }
      const start = coords[0];
      const end = coords[coords.length - 1];
      push([start.x, start.y - 1]);
      push([start.x + 1, start.y - 1]);
      push([start.x - 1, start.y - 1]);

      push([end.x, end.y + 1]);
      push([end.x - 1, end.y + 1]);
      push([end.x + 1, end.y + 1]);
    }

    for (let i = 0; i < mapData.map.length; i += 1) {
      if (mapData.map[i].ship) {
        const coords = mapData.map[i].ship.getCoordinates();
        if (coords.length === 1) {
          getHorizontal(coords);
        } else if (coords[0].y + 1 === coords[1].y) {
          getVertical(coords);
        } else {
          getHorizontal(coords);
        }
      }
    }
    return invalidCoords;
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

    const verticalFreeSpaceArr = mapData.getDictionary(freeSpaceArr).columns;

    const startingXPosArr = [];
    const startingYPosArr = [];

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

    function iterateHorizontal() {
      for (let i = 0; i < freeSpaceArr.length; i += 1) {
        for (let k = 0; k < shipSize; k += 1) {
          if (getHorizontalDiff(i, k).valid) {
            startingXPosArr.push(freeSpaceArr[i]);
          }
        }
      }
    }

    function iterateVertical() {
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
    }

    iterateHorizontal();
    iterateVertical();

    console.log({ startingXPosArr, startingYPosArr });

    return { startingXPosArr, startingYPosArr };
  }

  function placeShipPart(coords, ship) {
    const mapData = getMapData();
    const mapLocation = mapData.getCoordinateData(coords);
    if (mapLocation.ship) throw new Error("Occupied space");

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
    getInvalidCoords,
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
      const shipSize = playableShips[playableShipIndex].size;

      const randAxis = Math.floor(Math.random() * 2);

      let axis;
      let validStartingPositions;

      if (randAxis === 0) {
        axis = "x";
        validStartingPositions =
          player.gameBrd.getValidCoords(shipSize).startingXPosArr;
      }
      if (randAxis === 1) {
        axis = "y";
        validStartingPositions =
          player.gameBrd.getValidCoords(shipSize).startingYPosArr;
      }

      const coordIndex = Math.floor(
        Math.random() * validStartingPositions.length
      );
      const target = validStartingPositions[coordIndex];

      player.gameBrd.placeShip([target.x, target.y], shipSize, axis);

      playableShips[playableShipIndex].howMany -= 1;
      const log = {
        playableShips: player.playableShips,
        target,
        axis,
        shipSize,
        remainingShips: getRemainingShips(player),
      };
      console.log(log);
    }
  }

  random(self);

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
// game.self.gameBrd.placeShip([2, 2], 4, "horizontal");
// game.self.gameBrd.placeShip([3, 5], 4, "vertical");
// game.self.gameBrd.placeShip([7, 6], 1, "vertical");
// game.self.gameBrd.getValidCoords(4);
// console.log(
//   game.self.gameBrd.getMapData().getCoordinateData([3, 5]).ship.getCoordinates()
// );
// const validCoords = game.self.gameBrd.getValidCoords(4);
// tableSelf.renderClassname("x-starting", validCoords.startingXPosArr);
// tableSelf.renderClassname("y-starting", validCoords.startingYPosArr);
tableSelf.update(game.self.gameBrd.getShips());
// tableSelf.renderInvalidSpace(game.self.gameBrd.getInvalidCoords());

export { Game, Ship };
