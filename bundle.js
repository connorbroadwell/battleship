/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/DOM.js":
/*!****************************!*\
  !*** ./src/modules/DOM.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   tableRival: () => (/* binding */ tableRival),
/* harmony export */   tableSelf: () => (/* binding */ tableSelf)
/* harmony export */ });
const Table = (tableSize, parentQuery) => {
  const self = document.querySelector(`${parentQuery} .battlefield-table`);

  function getNewTableElement() {
    function getColMarker(datasetYPos) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const arr = alphabet.split("");
      return arr[datasetYPos];
    }

    const tableEl = document.createElement("table");
    tableEl.classList = "battlefield-table";
    const tableBody = document.createElement("tbody");
    tableEl.appendChild(tableBody);

    for (let i = 0; i < tableSize; i += 1) {
      const tableRow = document.createElement("tr");
      tableRow.classList = "battlefield-row";
      tableBody.appendChild(tableRow);

      for (let j = 0; j < tableSize; j += 1) {
        const tableDataCell = document.createElement("td");
        tableDataCell.classList = "battlefield-cell";
        tableRow.appendChild(tableDataCell);

        const battlefieldCellContent = document.createElement("div");
        battlefieldCellContent.classList = "battlefield-cell-content";
        battlefieldCellContent.dataset.x = i;
        battlefieldCellContent.dataset.y = j;
        tableDataCell.appendChild(battlefieldCellContent);

        if (battlefieldCellContent.dataset.x === 0) {
          const markerRow = document.createElement("div");
          markerRow.classList = "marker marker-row";
          markerRow.textContent = battlefieldCellContent.dataset.x + 1;
          battlefieldCellContent.appendChild(markerRow);
        }

        if (battlefieldCellContent.dataset.y === 0) {
          const markerCol = document.createElement("div");
          markerCol.classList = "marker marker-col";
          markerCol.textContent = getColMarker(
            battlefieldCellContent.dataset.y
          );
          battlefieldCellContent.appendChild(markerCol);
        }
      }
    }

    return tableEl;
  }

  const tableEl = getNewTableElement();

  const label = document.querySelector(`${parentQuery}-label`);
  if (parentQuery === ".battlefield-self") {
    label.textContent = "You";
  } else {
    label.textContent = "Rival";
  }

  function update(ships) {
    console.log(ships);
  }

  function render() {
    // eslint-disable-next-line no-param-reassign
    self.innerHTML = tableEl.innerHTML;
  }

  return {
    render,
    update,
  };
};

const tableSelf = Table(10, ".battlefield-self");
const tableRival = Table(10, ".battlefield-rival");

tableSelf.render();
tableRival.render();




/***/ }),

/***/ "./src/modules/battleship.js":
/*!***********************************!*\
  !*** ./src/modules/battleship.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game),
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
/* harmony import */ var _DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOM */ "./src/modules/DOM.js");


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
            // console.log({ test: column[j], test2: column[j + k], diff });
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
    if (mapLocation.ship) throw new Error("Occupied space!");

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
        if (coords[0] + shipSize < size) {
          cordData = [coords[0] + i, coords[1]];
        }
      } else if (direction === "vertical" || direction === "y") {
        if (coords[1] + shipSize < size) {
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

  function random(player) {
    const playableShipIndex = Math.floor(
      Math.random() * player.playableShips.length
    );
    const randAxis = Math.floor(Math.random() * 2);
    const shipSize = player.playableShips[playableShipIndex].size;
    let axis;
    if (randAxis === 0) {
      axis = "x";
    }
    if (randAxis === 1) {
      axis = "y";
    }

    player.playableShips[playableShipIndex].howMany -= 1;

    const validStartingPositions = player.gameBrd.getValidCoords(
      axis,
      shipSize
    );
    const coordIndex = Math.floor(
      Math.random() * validStartingPositions.length
    );
    const target = validStartingPositions[coordIndex];
    player.gameBrd.placeShip([target.x, target.y], shipSize, axis);

    const log = {
      playableShips: player.playableShips,
      target,
      axis,
      shipSize,
    };
    console.log(log);
  }

  random(self);
  _DOM__WEBPACK_IMPORTED_MODULE_0__.tableSelf.update(self.gameBrd.getShips());

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
game.self.gameBrd.placeShip([2, 2], 4, "vertical");




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/modules/DOM.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/modules/battleship.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzNCOztBQUVBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUUsMkNBQVM7O0FBRVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUEsV0FBVztBQUNYOztBQUVBO0FBQ0E7O0FBRXNCOzs7Ozs7O1VDN1R0QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFRhYmxlID0gKHRhYmxlU2l6ZSwgcGFyZW50UXVlcnkpID0+IHtcbiAgY29uc3Qgc2VsZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9IC5iYXR0bGVmaWVsZC10YWJsZWApO1xuXG4gIGZ1bmN0aW9uIGdldE5ld1RhYmxlRWxlbWVudCgpIHtcbiAgICBmdW5jdGlvbiBnZXRDb2xNYXJrZXIoZGF0YXNldFlQb3MpIHtcbiAgICAgIGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgICAgY29uc3QgYXJyID0gYWxwaGFiZXQuc3BsaXQoXCJcIik7XG4gICAgICByZXR1cm4gYXJyW2RhdGFzZXRZUG9zXTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgIHRhYmxlRWwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC10YWJsZVwiO1xuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKTtcbiAgICB0YWJsZUVsLmFwcGVuZENoaWxkKHRhYmxlQm9keSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlU2l6ZTsgaSArPSAxKSB7XG4gICAgICBjb25zdCB0YWJsZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0clwiKTtcbiAgICAgIHRhYmxlUm93LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtcm93XCI7XG4gICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlU2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlRGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIHRhYmxlRGF0YUNlbGwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC1jZWxsXCI7XG4gICAgICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKHRhYmxlRGF0YUNlbGwpO1xuXG4gICAgICAgIGNvbnN0IGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtY2VsbC1jb250ZW50XCI7XG4gICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC54ID0gaTtcbiAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnkgPSBqO1xuICAgICAgICB0YWJsZURhdGFDZWxsLmFwcGVuZENoaWxkKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgbWFya2VyUm93LmNsYXNzTGlzdCA9IFwibWFya2VyIG1hcmtlci1yb3dcIjtcbiAgICAgICAgICBtYXJrZXJSb3cudGV4dENvbnRlbnQgPSBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCArIDE7XG4gICAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5hcHBlbmRDaGlsZChtYXJrZXJSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55ID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbWFya2VyQ29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICBtYXJrZXJDb2wuY2xhc3NMaXN0ID0gXCJtYXJrZXIgbWFya2VyLWNvbFwiO1xuICAgICAgICAgIG1hcmtlckNvbC50ZXh0Q29udGVudCA9IGdldENvbE1hcmtlcihcbiAgICAgICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55XG4gICAgICAgICAgKTtcbiAgICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmFwcGVuZENoaWxkKG1hcmtlckNvbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFibGVFbDtcbiAgfVxuXG4gIGNvbnN0IHRhYmxlRWwgPSBnZXROZXdUYWJsZUVsZW1lbnQoKTtcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCR7cGFyZW50UXVlcnl9LWxhYmVsYCk7XG4gIGlmIChwYXJlbnRRdWVyeSA9PT0gXCIuYmF0dGxlZmllbGQtc2VsZlwiKSB7XG4gICAgbGFiZWwudGV4dENvbnRlbnQgPSBcIllvdVwiO1xuICB9IGVsc2Uge1xuICAgIGxhYmVsLnRleHRDb250ZW50ID0gXCJSaXZhbFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKHNoaXBzKSB7XG4gICAgY29uc29sZS5sb2coc2hpcHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHNlbGYuaW5uZXJIVE1MID0gdGFibGVFbC5pbm5lckhUTUw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlbmRlcixcbiAgICB1cGRhdGUsXG4gIH07XG59O1xuXG5jb25zdCB0YWJsZVNlbGYgPSBUYWJsZSgxMCwgXCIuYmF0dGxlZmllbGQtc2VsZlwiKTtcbmNvbnN0IHRhYmxlUml2YWwgPSBUYWJsZSgxMCwgXCIuYmF0dGxlZmllbGQtcml2YWxcIik7XG5cbnRhYmxlU2VsZi5yZW5kZXIoKTtcbnRhYmxlUml2YWwucmVuZGVyKCk7XG5cbmV4cG9ydCB7IHRhYmxlU2VsZiwgdGFibGVSaXZhbCB9O1xuIiwiaW1wb3J0IHsgdGFibGVTZWxmLCB0YWJsZVJpdmFsIH0gZnJvbSBcIi4vRE9NXCI7XG5cbmNvbnN0IFNoaXAgPSAoc2l6ZSkgPT4ge1xuICBjb25zdCBzaGlwU2l6ZSA9IHNpemU7XG4gIGxldCB0aW1lc0hpdCA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG4gIGxldCBjb29yZGluYXRlcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGdldFNpemUoKSB7XG4gICAgcmV0dXJuIHNoaXBTaXplO1xuICB9XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIHRpbWVzSGl0ICs9IDE7XG4gIH1cblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgaWYgKHRpbWVzSGl0ID09PSBzaGlwU2l6ZSkge1xuICAgICAgc3VuayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBzdW5rO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoKSB7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0Q29vcmRpbmF0ZXMoY29yZHMpIHtcbiAgICBjb29yZGluYXRlcyA9IGNvcmRzO1xuICB9XG5cbiAgcmV0dXJuIHsgZ2V0U2l6ZSwgaXNTdW5rLCBoaXQsIGdldENvb3JkaW5hdGVzLCBzZXRDb29yZGluYXRlcyB9O1xufTtcblxuY29uc3QgR2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBzaXplID0gMTA7XG5cbiAgZnVuY3Rpb24gZ2V0Q29sTWFya2VyKHlQb3MpIHtcbiAgICBjb25zdCBhbHBoYWJldCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpcIjtcbiAgICBjb25zdCBhcnIgPSBhbHBoYWJldC5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4gYXJyW3lQb3NdO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkgKz0gMSkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqICs9IDEpIHtcbiAgICAgICAgYXJyLnB1c2goeyB4OiBpLCB5OiBqLCByb3c6IGkgKyAxLCBjb2w6IGdldENvbE1hcmtlcihqKSB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIGNvbnN0IG1hcCA9IGluaXQoKTtcblxuICBmdW5jdGlvbiBnZXRNYXBEYXRhKCkge1xuICAgIGZ1bmN0aW9uIGdldERpY3Rpb25hcnkobWFwQXJyID0gbWFwKSB7XG4gICAgICBjb25zdCBkaWN0aW9uYXJ5ID0ge1xuICAgICAgICBjb2x1bW5zOiBbXSxcbiAgICAgICAgcm93czogW10sXG4gICAgICB9O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgYXJyQ29sdW1ucyA9IG1hcEFyci5maWx0ZXIoXG4gICAgICAgICAgKHZhbHVlKSA9PiB2YWx1ZS5jb2wgPT09IGdldENvbE1hcmtlcihpKVxuICAgICAgICApO1xuICAgICAgICBkaWN0aW9uYXJ5LmNvbHVtbnMucHVzaChhcnJDb2x1bW5zKTtcblxuICAgICAgICBjb25zdCBhcnJSb3dzID0gbWFwQXJyLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnJvdyA9PT0gaSArIDEpO1xuICAgICAgICBkaWN0aW9uYXJ5LnJvd3MucHVzaChhcnJSb3dzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRpY3Rpb25hcnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXhCeUNvb3JkaW5hdGUoY29vcmRzKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtYXAuZmluZEluZGV4KFxuICAgICAgICAodmFsdWUpID0+IHZhbHVlLnggPT09IGNvb3Jkc1swXSAmJiB2YWx1ZS55ID09PSBjb29yZHNbMV1cbiAgICAgICk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvb3JkaW5hdGVCeUluZGV4KGluZGV4KSB7XG4gICAgICByZXR1cm4gbWFwW2luZGV4XTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb29yZGluYXRlRGF0YShjb29yZHMpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZ2V0SW5kZXhCeUNvb3JkaW5hdGUoY29vcmRzKTtcbiAgICAgIHJldHVybiBnZXRDb29yZGluYXRlQnlJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldENvb3JkaW5hdGVEYXRhLFxuICAgICAgbWFwLFxuICAgICAgZ2V0RGljdGlvbmFyeSxcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4gc2l6ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFsbFNoaXBzU3VuaygpIHtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGNvbnN0IHNoaXBzID0gbWFwRGF0YS5tYXAuZmlsdGVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlLnNoaXApIHtcbiAgICAgICAgcmV0dXJuICF2YWx1ZS5zaGlwLmlzU3VuaygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChzaGlwcy5sZW5ndGggPT09IDApIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFNoaXBzKCkge1xuICAgIGNvbnN0IG1hcERhdGEgPSBnZXRNYXBEYXRhKCk7XG4gICAgcmV0dXJuIG1hcERhdGEubWFwLmZpbHRlcigodmFsdWUpID0+IHZhbHVlLnNoaXApO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlmZmVyZW5jZShudW0xLCBudW0yKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKG51bTEgLSBudW0yKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZhbGlkQ29vcmRzKGF4aXMsIHNoaXBTaXplKSB7XG4gICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICBjb25zdCBmcmVlU3BhY2UgPSBtYXBEYXRhLm1hcC5maWx0ZXIoKHZhbHVlKSA9PiAhdmFsdWUuc2hpcCk7XG4gICAgY29uc3QgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucyA9IFtdO1xuICAgIGxldCBkaWN0aW9uYXJ5O1xuXG4gICAgZnVuY3Rpb24gZ2V0Q29sdW1ucygpIHtcbiAgICAgIHJldHVybiBtYXBEYXRhLmdldERpY3Rpb25hcnkoZnJlZVNwYWNlKS5jb2x1bW5zO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJvd3MoKSB7XG4gICAgICByZXR1cm4gbWFwRGF0YS5nZXREaWN0aW9uYXJ5KGZyZWVTcGFjZSkucm93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb2x1bW5EYXRhKGNvbHVtbkRhdGEpIHtcbiAgICAgIGlmIChheGlzID09PSBcInhcIikgcmV0dXJuIGNvbHVtbkRhdGEueDtcbiAgICAgIGlmIChheGlzID09PSBcInlcIikgcmV0dXJuIGNvbHVtbkRhdGEueTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChheGlzID09PSBcInhcIikge1xuICAgICAgZGljdGlvbmFyeSA9IGdldENvbHVtbnMoKTtcbiAgICB9IGVsc2UgaWYgKGF4aXMgPT09IFwieVwiKSB7XG4gICAgICBkaWN0aW9uYXJ5ID0gZ2V0Um93cygpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGljdGlvbmFyeS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgY29sdW1uID0gZGljdGlvbmFyeVtpXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW4ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzaGlwU2l6ZTsgayArPSAxKSB7XG4gICAgICAgICAgaWYgKGogKyBrIDwgY29sdW1uLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IGRpZmZlcmVuY2UoXG4gICAgICAgICAgICAgIGdldENvbHVtbkRhdGEoY29sdW1uW2pdKSxcbiAgICAgICAgICAgICAgZ2V0Q29sdW1uRGF0YShjb2x1bW5baiArIGtdKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHsgdGVzdDogY29sdW1uW2pdLCB0ZXN0MjogY29sdW1uW2ogKyBrXSwgZGlmZiB9KTtcbiAgICAgICAgICAgIGlmIChkaWZmID09PSBzaGlwU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgICAgdmFsaWRTdGFydGluZ1Bvc2l0aW9ucy5wdXNoKGNvbHVtbltqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWxpZFN0YXJ0aW5nUG9zaXRpb25zO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwUGFydChjb29yZHMsIHNoaXApIHtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGNvbnN0IG1hcExvY2F0aW9uID0gbWFwRGF0YS5nZXRDb29yZGluYXRlRGF0YShjb29yZHMpO1xuICAgIGlmIChtYXBMb2NhdGlvbi5zaGlwKSB0aHJvdyBuZXcgRXJyb3IoXCJPY2N1cGllZCBzcGFjZSFcIik7XG5cbiAgICBtYXBMb2NhdGlvbi5zaGlwID0gc2hpcDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChjb29yZHMsIHNoaXBTaXplLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoXG4gICAgICBkaXJlY3Rpb24gIT09IFwiaG9yaXpvbnRhbFwiICYmXG4gICAgICBkaXJlY3Rpb24gIT09IFwidmVydGljYWxcIiAmJlxuICAgICAgZGlyZWN0aW9uICE9PSBcInhcIiAmJlxuICAgICAgZGlyZWN0aW9uICE9PSBcInlcIlxuICAgIClcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoaXAgbXVzdCBoYXZlIGEgZGlyZWN0aW9uXCIpO1xuXG4gICAgY29uc3Qgc2hpcCA9IFNoaXAoc2hpcFNpemUpO1xuICAgIGNvbnN0IGFycmF5Q29yZHMgPSBbXTtcbiAgICBjb25zdCBtYXBEYXRhID0gZ2V0TWFwRGF0YSgpO1xuICAgIGxldCBjb3JkRGF0YTtcblxuICAgIGZ1bmN0aW9uIHB1c2hDb29yZERhdGFJbnRvU2hpcChkYXRhKSB7XG4gICAgICBjb25zdCBtYXBDb29yZHNDbG9uZSA9IEpTT04ucGFyc2UoXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KG1hcERhdGEuZ2V0Q29vcmRpbmF0ZURhdGEoZGF0YSkpXG4gICAgICApO1xuICAgICAgZGVsZXRlIG1hcENvb3Jkc0Nsb25lLnNoaXA7XG4gICAgICBhcnJheUNvcmRzLnB1c2gobWFwQ29vcmRzQ2xvbmUpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFNpemU7IGkgKz0gMSkge1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgfHwgZGlyZWN0aW9uID09PSBcInhcIikge1xuICAgICAgICBpZiAoY29vcmRzWzBdICsgc2hpcFNpemUgPCBzaXplKSB7XG4gICAgICAgICAgY29yZERhdGEgPSBbY29vcmRzWzBdICsgaSwgY29vcmRzWzFdXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IFwidmVydGljYWxcIiB8fCBkaXJlY3Rpb24gPT09IFwieVwiKSB7XG4gICAgICAgIGlmIChjb29yZHNbMV0gKyBzaGlwU2l6ZSA8IHNpemUpIHtcbiAgICAgICAgICBjb3JkRGF0YSA9IFtjb29yZHNbMF0sIGNvb3Jkc1sxXSArIGldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBsYWNlbWVudDogU2hpcCB3aWxsIG5vdCBmaXRcIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgY29yZERhdGEgPT09IFwidW5kZWZpbmVkXCIgfHwgY29yZERhdGEgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvb3JkaW5hdGVzIG11c3Qgbm90IGJlIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuXG4gICAgICBwbGFjZVNoaXBQYXJ0KGNvcmREYXRhLCBzaGlwKTtcbiAgICAgIHB1c2hDb29yZERhdGFJbnRvU2hpcChjb3JkRGF0YSk7XG4gICAgfVxuXG4gICAgc2hpcC5zZXRDb29yZGluYXRlcyhhcnJheUNvcmRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2soY29vcmRzKSB7XG4gICAgY29uc3QgbWFwRGF0YSA9IGdldE1hcERhdGEoKTtcbiAgICBjb25zdCB0YXJnZXQgPSBtYXBEYXRhLmdldENvb3JkaW5hdGVEYXRhKGNvb3Jkcyk7XG4gICAgaWYgKHRhcmdldC5taXNzIHx8IHRhcmdldC5oaXQpIHJldHVybjtcbiAgICBpZiAodGFyZ2V0LnNoaXApIHtcbiAgICAgIGlmICh0YXJnZXQuc2hpcC5pc1N1bmsoKSkgcmV0dXJuO1xuICAgICAgdGFyZ2V0LnNoaXAuaGl0KCk7XG4gICAgICB0YXJnZXQuaGl0ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0Lm1pc3MgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0U2l6ZSxcbiAgICBwbGFjZVNoaXAsXG4gICAgcGxhY2VTaGlwUGFydCxcbiAgICBhbGxTaGlwc1N1bmssXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBnZXRNYXBEYXRhLFxuICAgIGdldFZhbGlkQ29vcmRzLFxuICAgIGdldFNoaXBzLFxuICB9O1xufTtcblxuY29uc3QgUGxheWVyID0gKCkgPT4ge1xuICBjb25zdCBnYW1lQnJkID0gR2FtZWJvYXJkKCk7XG4gIGNvbnN0IHBsYXlhYmxlU2hpcHMgPSBbXG4gICAgeyBzaXplOiAxLCBob3dNYW55OiA0IH0sXG4gICAgeyBzaXplOiAyLCBob3dNYW55OiAzIH0sXG4gICAgeyBzaXplOiAzLCBob3dNYW55OiAyIH0sXG4gICAgeyBzaXplOiA0LCBob3dNYW55OiAxIH0sXG4gIF07XG5cbiAgcmV0dXJuIHsgZ2FtZUJyZCwgcGxheWFibGVTaGlwcyB9O1xufTtcblxuLy8gYnkgZGVmYXVsdCB0aGUgZ2FtZSB3aWxsIGhhdmUgMTAgc2hpcHMgb24gYSBncmlkIHdpdGggYSBzaXplIG9mIDEwXG5jb25zdCBHYW1lID0gKCkgPT4ge1xuICBjb25zdCBzZWxmID0gUGxheWVyKCk7XG4gIGNvbnN0IHJpdmFsID0gUGxheWVyKCk7XG5cbiAgZnVuY3Rpb24gcmFuZG9tKHBsYXllcikge1xuICAgIGNvbnN0IHBsYXlhYmxlU2hpcEluZGV4ID0gTWF0aC5mbG9vcihcbiAgICAgIE1hdGgucmFuZG9tKCkgKiBwbGF5ZXIucGxheWFibGVTaGlwcy5sZW5ndGhcbiAgICApO1xuICAgIGNvbnN0IHJhbmRBeGlzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgY29uc3Qgc2hpcFNpemUgPSBwbGF5ZXIucGxheWFibGVTaGlwc1twbGF5YWJsZVNoaXBJbmRleF0uc2l6ZTtcbiAgICBsZXQgYXhpcztcbiAgICBpZiAocmFuZEF4aXMgPT09IDApIHtcbiAgICAgIGF4aXMgPSBcInhcIjtcbiAgICB9XG4gICAgaWYgKHJhbmRBeGlzID09PSAxKSB7XG4gICAgICBheGlzID0gXCJ5XCI7XG4gICAgfVxuXG4gICAgcGxheWVyLnBsYXlhYmxlU2hpcHNbcGxheWFibGVTaGlwSW5kZXhdLmhvd01hbnkgLT0gMTtcblxuICAgIGNvbnN0IHZhbGlkU3RhcnRpbmdQb3NpdGlvbnMgPSBwbGF5ZXIuZ2FtZUJyZC5nZXRWYWxpZENvb3JkcyhcbiAgICAgIGF4aXMsXG4gICAgICBzaGlwU2l6ZVxuICAgICk7XG4gICAgY29uc3QgY29vcmRJbmRleCA9IE1hdGguZmxvb3IoXG4gICAgICBNYXRoLnJhbmRvbSgpICogdmFsaWRTdGFydGluZ1Bvc2l0aW9ucy5sZW5ndGhcbiAgICApO1xuICAgIGNvbnN0IHRhcmdldCA9IHZhbGlkU3RhcnRpbmdQb3NpdGlvbnNbY29vcmRJbmRleF07XG4gICAgcGxheWVyLmdhbWVCcmQucGxhY2VTaGlwKFt0YXJnZXQueCwgdGFyZ2V0LnldLCBzaGlwU2l6ZSwgYXhpcyk7XG5cbiAgICBjb25zdCBsb2cgPSB7XG4gICAgICBwbGF5YWJsZVNoaXBzOiBwbGF5ZXIucGxheWFibGVTaGlwcyxcbiAgICAgIHRhcmdldCxcbiAgICAgIGF4aXMsXG4gICAgICBzaGlwU2l6ZSxcbiAgICB9O1xuICAgIGNvbnNvbGUubG9nKGxvZyk7XG4gIH1cblxuICByYW5kb20oc2VsZik7XG4gIHRhYmxlU2VsZi51cGRhdGUoc2VsZi5nYW1lQnJkLmdldFNoaXBzKCkpO1xuXG4gIGZ1bmN0aW9uIGdldFBsYXlhYmxlU2hpcHMoKSB7XG4gICAgY29uc3QgdG90YWwgPSBwbGF5YWJsZVNoaXBzLnJlZHVjZShcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduLCBuby1wYXJhbS1yZWFzc2lnblxuICAgICAgKHByZXYsIGN1cikgPT4gKGN1ci5ob3dNYW55ICs9IHByZXYuaG93TWFueSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHsgcGxheWFibGVTaGlwcywgdG90YWwgfTtcbiAgfVxuXG4gIHJldHVybiB7IGdldFBsYXlhYmxlU2hpcHMsIHNlbGYsIHJpdmFsIH07XG59O1xuXG5jb25zdCBnYW1lID0gR2FtZSgpO1xuZ2FtZS5zZWxmLmdhbWVCcmQucGxhY2VTaGlwKFsyLCAyXSwgNCwgXCJ2ZXJ0aWNhbFwiKTtcblxuZXhwb3J0IHsgR2FtZSwgU2hpcCB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbW9kdWxlcy9ET00uanNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9tb2R1bGVzL2JhdHRsZXNoaXAuanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=