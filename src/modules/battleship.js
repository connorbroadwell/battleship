import { Table, renderNotification } from "./DOM";
import { logArrays, difference } from "./utility";
const { stripIndents } = require("common-tags");

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
    function getDictionary(mapArr = map.slice()) {
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
      return map.slice()[index];
    }

    //             |
    // attackable! V

    function getRandomAttackableCoordinate() {
      const filteredMap = map.filter((value) => !value.hit && !value.miss);
      const index = Math.floor(Math.random() * map.length);
      return map.slice()[index];
    }

    function space(coord) {
      const index = getIndexByCoordinate(coord);
      function get() {
        return getCoordinateByIndex(index);
      }

      function hasShip() {
        if (map.slice()[index].ship) return true;
        return false;
      }

      function isHit() {
        if (map.slice()[index].hit) return true;
        return false;
      }

      function setHit() {
        map[index].hit = true;
      }

      function hasMissed() {
        if (map.slice()[index].miss) return true;
        return false;
      }

      function setMissed() {
        map[index].miss = true;
      }

      function setOccupied(bool) {
        map[index].occupied = bool;
      }

      function isOccupied() {
        if (map.slice()[index].occupied) return true;
        return false;
      }

      function setShip(shp) {
        if (hasShip() || isOccupied()) return;
        map[index].ship = shp;
      }

      function ship() {
        if (!hasShip()) throw new Error("There is not a ship on this tile");
        const shp = map.slice()[index].ship;
        function getShip() {
          return shp;
        }
        function getLog() {
          return stripIndents`
          There is a ship at ${shp.getCoordinates()}
          Row: ${shp.row}
          Column: ${shp.col}
          Size: ${shp.getSize()}
          Axis: ${shp.getAxis()}
          Alive: ${!shp.isSunk()}
          `;
        }
        return { getShip, getLog };
      }

      return {
        get,
        setOccupied,
        setShip,
        hasShip,
        ship,
        isHit,
        setHit,
        hasMissed,
        setMissed,
      };
    }

    function getMap() {
      return map.slice();
    }

    function getFreeSpaces() {
      return map.slice().filter((value) => !value.ship && !value.occupied);
    }

    function allShips() {
      const arr = map.slice().filter((value) => value.ship);

      const getAll = () => arr;
      const log = () => logArrays(arr);
      const sunk = () =>
        arr.filter((value) => !value.ship.isSunk()).length === 0;

      return { getAll, log, sunk };
    }

    return {
      space,
      getDictionary,
      getFreeSpaces,
      allShips,
      getMap,
    };
  }

  function getSize() {
    return size;
  }

  function getValidCoords(shipSize) {
    function vertical() {
      const mapData = getMapData();
      const freeSpaceArr = mapData.getFreeSpaces();
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
      const mapData = getMapData();
      const freeSpaceArr = mapData.getFreeSpaces();
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

    function getVertical() {
      let adjacentOccupiedSpaceVertical = [
        [start.x, start.y - 1],
        [start.x + 1, start.y - 1],
        [start.x - 1, start.y - 1],

        [end.x, end.y + 1],
        [end.x - 1, end.y + 1],
        [end.x + 1, end.y + 1],
      ];

      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceVertical.push([coords[j].x + 1, coords[j].y]);
        adjacentOccupiedSpaceVertical.push([coords[j].x - 1, coords[j].y]);
      }

      adjacentOccupiedSpaceVertical = adjacentOccupiedSpaceVertical.filter(
        (value) =>
          !(value[0] > size - 1) &&
          !(value[1] > size - 1) &&
          !(value[0] < 0) &&
          !(value[1] < 0)
      );

      for (let i = 0; i < adjacentOccupiedSpaceVertical.length; i += 1) {
        mapData.space(adjacentOccupiedSpaceVertical[i]).setOccupied(true);
      }
      return adjacentOccupiedSpaceVertical;
    }

    function getHorizontal() {
      let adjacentOccupiedSpaceHorizontal = [
        [start.x - 1, start.y],
        [start.x - 1, start.y + 1],
        [start.x - 1, start.y - 1],

        [end.x + 1, end.y],
        [end.x + 1, end.y + 1],
        [end.x + 1, end.y - 1],
      ];

      for (let j = 0; j < coords.length; j += 1) {
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y + 1]);
        adjacentOccupiedSpaceHorizontal.push([coords[j].x, coords[j].y - 1]);
      }

      adjacentOccupiedSpaceHorizontal = adjacentOccupiedSpaceHorizontal.filter(
        (value) =>
          !(value[0] > size - 1) &&
          !(value[1] > size - 1) &&
          !(value[0] < 0) &&
          !(value[1] < 0)
      );

      for (let i = 0; i < adjacentOccupiedSpaceHorizontal.length; i += 1) {
        mapData.space(adjacentOccupiedSpaceHorizontal[i]).setOccupied(true);
      }
      return adjacentOccupiedSpaceHorizontal;
    }

    if (ship.getAxis() === "x") {
      return getHorizontal();
    }
    if (ship.getAxis() === "y") {
      return getVertical();
    }
  }

  function placeShipPart(coords, ship) {
    getMapData().space(coords).setShip(ship);
  }

  function placeShip(coords, shipSize, axis) {
    if (axis !== "x" && axis !== "y")
      throw new Error("Ship must have a valid direction");
    if (axis === "x") {
      if (shipSize + coords[0] > size) return;
    }
    if (axis === "y") {
      if (shipSize + coords[1] > size) return;
    }

    const ship = Ship(shipSize, axis);

    const arrayCords = [];
    const mapData = getMapData();
    let cordData;

    function pushCoordDataIntoShip(data) {
      const mapCoordsClone = JSON.parse(
        JSON.stringify(mapData.space(data).get())
      );
      delete mapCoordsClone.ship;
      arrayCords.push(mapCoordsClone);
    }

    const shpSize = ship.getSize();

    for (let i = 0; i < shpSize; i += 1) {
      if (ship.getAxis() === "x") {
        if (coords[0] + shpSize <= size) {
          cordData = [coords[0] + i, coords[1]];
        }
      } else if (ship.getAxis() === "y") {
        if (coords[1] + shpSize <= size) {
          cordData = [coords[0], coords[1] + i];
        }
      }

      if (typeof cordData === "undefined" || cordData === null) {
        console.log({ coords, axis, shipSize });
        throw new Error("Coordinates must not be null or undefined");
      }

      placeShipPart(cordData, ship);
      pushCoordDataIntoShip(cordData);
    }

    ship.setCoordinates(arrayCords);
    setOccupiedSpace(ship);
  }

  function receiveAttack(coords) {
    const mapData = getMapData();
    if (mapData.space(coords).hasMissed() || mapData.space(coords).isHit())
      return null;
    if (mapData.space(coords).hasShip()) {
      const shp = mapData.space(coords).ship().getShip();
      shp.hit();
      mapData.space(coords).setHit();
      if (shp.isSunk() && !mapData.allShips().sunk()) {
        return { sunk: shp.isSunk(), shipCords: shp.getCoordinates() };
      }
      if (mapData.allShips().sunk())
        return {
          sunk: shp.isSunk(),
          gameover: true,
          shipCords: shp.getCoordinates(),
        };
      return { hit: mapData.space(coords).isHit() };
    }
    mapData.space(coords).setMissed();
    return { miss: mapData.space(coords).hasMissed() };
  }

  return {
    getSize,
    placeShip,
    placeShipPart,
    receiveAttack,
    getMapData,
    getValidCoords,
  };
};

const Player = (name, tableQuerySelector) => {
  const gameBrd = Gameboard();
  const playableShips = [
    { size: 1, howMany: 4 },
    { size: 2, howMany: 3 },
    { size: 3, howMany: 2 },
    { size: 4, howMany: 1 },
  ];
  const table = Table(10, tableQuerySelector);
  let turn = false;
  let id;

  function setTurn(bool) {
    turn = bool;
  }

  function getTurn() {
    return turn;
  }

  function getName() {
    return name;
  }

  function setId(str) {
    id = str;
  }

  function getId() {
    return id;
  }

  // TODO write test that multiples the size by howMany and expect with the default board size
  // and playable ships
  // it will equal 20

  return {
    gameBrd,
    playableShips,
    table,
    setTurn,
    getTurn,
    getName,
    setId,
    getId,
  };
};

// by default the game will have 10 ships on a grid with a size of 10
const Game = () => {
  const self = Player("You", ".battlefield-self");
  const rival = Player("Rival", ".battlefield-rival");
  const players = [self, rival];

  self.setId("self");
  self.setTurn(true);

  rival.setId("rival");

  function getTurn() {
    let currentTurn;
    let nextTurn;
    players.forEach((player) => {
      if (player.getTurn()) {
        currentTurn = player;
      } else {
        nextTurn = player;
      }
    });
    return { currentTurn, nextTurn };
  }

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

      const coordIndex = Math.floor(
        Math.random() * validStartingPositions.length
      );

      const getTarget = () => validStartingPositions[coordIndex];

      let target = getTarget();
      while (target === undefined || target === null) {
        target = getTarget();
      }

      const log = {
        playableShips: player.playableShips,
        target,
        axis,
        shipSize,
        remainingShips: getRemainingShipsToPlace(player),
        validStartingPositions,
        coordIndex,
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

  return { self, rival, getTurn };
};

export { Game, Ship };
