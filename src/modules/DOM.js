const Table = (tableSize, parentQuery) => {
  const self = document.querySelector(`${parentQuery} .battlefield-table`);
  let xray = false;

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
        battlefieldCellContent.dataset.x = j;
        battlefieldCellContent.dataset.y = i;
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

  function toggleDisabled() {
    document.querySelector(parentQuery).classList.toggle("disabled");
  }

  function toggleAttackCursor() {
    document
      .querySelectorAll(`${parentQuery} .battlefield-cell-content`)
      .forEach((value) =>
        value.classList.contains("miss") || value.classList.contains("hit")
          ? null
          : value.classList.toggle("attack-cursor")
      );
  }

  function renderSunk(cell) {
    cell.classList.add("sunk");
  }

  function xrayEnabled() {
    return xray;
  }

  function toggleXray() {
    // eslint-disable-next-line no-unused-expressions
    xray ? (xray = false) : (xray = true);
  }

  function renderMiss(cell) {
    cell.classList.add("miss");
    const missIcon = document.createElement("span");
    missIcon.classList = "miss-icon";
    cell.appendChild(missIcon);
  }

  function renderHit(cell) {
    cell.classList.add("hit");
    const hitIcon = document.createElement("span");
    hitIcon.classList = "hit-icon";
    cell.appendChild(hitIcon);
  }

  function renderShip(cell) {
    cell.classList.add("ship");
  }

  function update(player) {
    const { gameBrd } = player;
    const map = gameBrd.getMapData().getMap();
    for (let i = 0; i < map.length; i += 1) {
      const shipCell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${map[i].x}"][data-y="${map[i].y}"]`
      );
      const mapSpace = gameBrd.getMapData().space([map[i].x, map[i].y]);
      if (mapSpace.hasShip()) {
        if (xrayEnabled() || player.getTurn()) {
          renderShip(shipCell);
        }
        if (mapSpace.ship().getShip().isSunk()) renderSunk(shipCell);
      }
      if (mapSpace.hasMissed()) renderMiss(shipCell);
      if (mapSpace.isHit()) renderHit(shipCell);
    }
  }

  function renderInvalidSpace(invalidSpaceArr) {
    const arr = invalidSpaceArr;
    for (let i = 0; i < arr.length; i += 1) {
      const cell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${arr[i][0]}"][data-y="${arr[i][1]}"]`
      );
      cell.classList.add("invalid");
    }
  }

  function renderClassname(className, array) {
    const arr = array;
    for (let i = 0; i < arr.length; i += 1) {
      const cell = document.querySelector(
        `${parentQuery} .battlefield-cell-content[data-x="${arr[i].x}"][data-y="${arr[i].y}"]`
      );
      cell.classList.add(className);
    }
  }

  function render() {
    // eslint-disable-next-line no-param-reassign
    self.innerHTML = tableEl.innerHTML;
  }

  function addAttackEventListener(attackEvent) {
    document
      .querySelectorAll(
        `${parentQuery} .battlefield-cell-content.attack-cursor`
      )
      .forEach((value) => value.addEventListener("click", attackEvent));
  }

  function renderAttackResult(attack, coords) {
    const cell = document.querySelector(
      `${parentQuery} .battlefield-cell-content.attack-cursor[data-x="${coords[0]}"][data-y="${coords[1]}"]`
    );
    if (attack.miss) {
      renderMiss(cell);
    }
    if (attack.hit || attack.sunk) {
      renderHit(cell);
    }
    if (attack.sunk) {
      attack.shipCords.forEach((value) => {
        document
          .querySelector(
            `${parentQuery} .battlefield-cell-content[data-x="${value.x}"][data-y="${value.y}"]`
          )
          .classList.add("sunk");
      });
    }
  }

  return {
    render,
    update,
    renderInvalidSpace,
    renderClassname,
    toggleDisabled,
    toggleAttackCursor,
    addAttackEventListener,
    renderAttackResult,
  };
};

function renderNotification(msg) {
  document.querySelector(".notification-message").innerHTML = msg;
}

function renderVictoryScreen(championName, championId, loserId) {
  document.querySelector(".battlefields").remove();
  document.querySelector(".notification-wrap").remove();

  const victoryScreen = document.createElement("div");
  victoryScreen.classList.add("game-over");

  victoryScreen.innerHTML = `
    <div class="game-over-message-container">
      <div class="game-over-message">
        <div class="game-over-text">Game Over</div>
        <div class="congrats"><span class="${championId}-victory">${championName}</span> <span class="${loserId}-victory">Wins!</div>
    </div>
  `;
  document.querySelector("main").appendChild(victoryScreen);
}

export { Table, renderNotification, renderVictoryScreen };
