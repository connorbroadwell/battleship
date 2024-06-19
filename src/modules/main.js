import { Game } from "./battleship";
import { renderNotification, renderVictoryScreen } from "./DOM";

const game = Game();

const { self } = game;
const { rival } = game;
const { currentTurn } = game.getTurn();
const { nextTurn } = game.getTurn();

self.table.render();
rival.table.render();

self.table.update(self.gameBrd.getMapData().allShips().getAll());
rival.table.update(rival.gameBrd.getMapData().allShips().getAll());

nextTurn.table.toggleAttackCursor();

renderNotification(
  `It is <span class="${currentTurn.getId()}-victory">${currentTurn.getName()}'s</span> turn, click on <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}'s</span> board to attack`
);

currentTurn.table.toggleDisabled();

nextTurn.table.addAttackEventListener((e) => {
  const x = Number(e.currentTarget.dataset.x);
  const y = Number(e.currentTarget.dataset.y);
  const attack = nextTurn.gameBrd.receiveAttack([x, y]);
  console.log(attack);
  if (attack !== null) {
    nextTurn.table.renderAttackResult(attack, [x, y]);
    if (attack.gameover)
      renderVictoryScreen(currentTurn.getName(), currentTurn.getId());
  }
});

// renderVictoryScreen("ballzingus", "self");
