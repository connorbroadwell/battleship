/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************!*\
  !*** ./src/modules/DOM.js ***!
  \****************************/
const Table = (tableSize) => {
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
      for (let j = 0; j < tableSize; j += 1) {
        const tableRow = document.createElement("tr");
        tableRow.classList = "battlefield-row";
        tableBody.appendChild(tableRow);

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

  function appendSelfToParent(parentEl) {
    parentEl.appendChild(tableEl);
  }

  function update() {}

  function render() {}
};

const tableSelf = Table(10);
const tableRival = Table(10);

tableSelf.appendSelfToParent(document.querySelector(".battlefield-self"));
tableRival.appendSelfToParent(document.querySelector(".battlefield-rival"));

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************!*\
  !*** ./src/modules/battleship.js ***!
  \***********************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************!*\
  !*** ./src/modules/gameloop.js ***!
  \*********************************/

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsZUFBZTtBQUNuQyxzQkFBc0IsZUFBZTtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0RPTS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvYmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWxvb3AuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgVGFibGUgPSAodGFibGVTaXplKSA9PiB7XG4gIGZ1bmN0aW9uIGdldE5ld1RhYmxlRWxlbWVudCgpIHtcbiAgICBmdW5jdGlvbiBnZXRDb2xNYXJrZXIoZGF0YXNldFlQb3MpIHtcbiAgICAgIGNvbnN0IGFscGhhYmV0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWlwiO1xuICAgICAgY29uc3QgYXJyID0gYWxwaGFiZXQuc3BsaXQoXCJcIik7XG4gICAgICByZXR1cm4gYXJyW2RhdGFzZXRZUG9zXTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWJsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRhYmxlXCIpO1xuICAgIHRhYmxlRWwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC10YWJsZVwiO1xuICAgIGNvbnN0IHRhYmxlQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0Ym9keVwiKTtcbiAgICB0YWJsZUVsLmFwcGVuZENoaWxkKHRhYmxlQm9keSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhYmxlU2l6ZTsgaSArPSAxKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRhYmxlU2l6ZTsgaiArPSAxKSB7XG4gICAgICAgIGNvbnN0IHRhYmxlUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRyXCIpO1xuICAgICAgICB0YWJsZVJvdy5jbGFzc0xpc3QgPSBcImJhdHRsZWZpZWxkLXJvd1wiO1xuICAgICAgICB0YWJsZUJvZHkuYXBwZW5kQ2hpbGQodGFibGVSb3cpO1xuXG4gICAgICAgIGNvbnN0IHRhYmxlRGF0YUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgIHRhYmxlRGF0YUNlbGwuY2xhc3NMaXN0ID0gXCJiYXR0bGVmaWVsZC1jZWxsXCI7XG4gICAgICAgIHRhYmxlUm93LmFwcGVuZENoaWxkKHRhYmxlRGF0YUNlbGwpO1xuXG4gICAgICAgIGNvbnN0IGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmNsYXNzTGlzdCA9IFwiYmF0dGxlZmllbGQtY2VsbC1jb250ZW50XCI7XG4gICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC54ID0gaTtcbiAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5kYXRhc2V0LnkgPSBqO1xuICAgICAgICB0YWJsZURhdGFDZWxsLmFwcGVuZENoaWxkKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQpO1xuXG4gICAgICAgIGlmIChiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCA9PT0gMCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlclJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgbWFya2VyUm93LmNsYXNzTGlzdCA9IFwibWFya2VyIG1hcmtlci1yb3dcIjtcbiAgICAgICAgICBtYXJrZXJSb3cudGV4dENvbnRlbnQgPSBiYXR0bGVmaWVsZENlbGxDb250ZW50LmRhdGFzZXQueCArIDE7XG4gICAgICAgICAgYmF0dGxlZmllbGRDZWxsQ29udGVudC5hcHBlbmRDaGlsZChtYXJrZXJSb3cpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55ID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgbWFya2VyQ29sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICBtYXJrZXJDb2wuY2xhc3NMaXN0ID0gXCJtYXJrZXIgbWFya2VyLWNvbFwiO1xuICAgICAgICAgIG1hcmtlckNvbC50ZXh0Q29udGVudCA9IGdldENvbE1hcmtlcihcbiAgICAgICAgICAgIGJhdHRsZWZpZWxkQ2VsbENvbnRlbnQuZGF0YXNldC55XG4gICAgICAgICAgKTtcbiAgICAgICAgICBiYXR0bGVmaWVsZENlbGxDb250ZW50LmFwcGVuZENoaWxkKG1hcmtlckNvbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFibGVFbDtcbiAgfVxuXG4gIGNvbnN0IHRhYmxlRWwgPSBnZXROZXdUYWJsZUVsZW1lbnQoKTtcblxuICBmdW5jdGlvbiBhcHBlbmRTZWxmVG9QYXJlbnQocGFyZW50RWwpIHtcbiAgICBwYXJlbnRFbC5hcHBlbmRDaGlsZCh0YWJsZUVsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHt9XG5cbiAgZnVuY3Rpb24gcmVuZGVyKCkge31cbn07XG5cbmNvbnN0IHRhYmxlU2VsZiA9IFRhYmxlKDEwKTtcbmNvbnN0IHRhYmxlUml2YWwgPSBUYWJsZSgxMCk7XG5cbnRhYmxlU2VsZi5hcHBlbmRTZWxmVG9QYXJlbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5iYXR0bGVmaWVsZC1zZWxmXCIpKTtcbnRhYmxlUml2YWwuYXBwZW5kU2VsZlRvUGFyZW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmF0dGxlZmllbGQtcml2YWxcIikpO1xuIiwiIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9