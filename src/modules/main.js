import { Game } from "./battleship";
import {
  getBodyInnerHTML,
  renderNotification,
  renderPassScreen,
  renderVictoryScreen,
  setBodyInnerHTML,
  Table,
} from "./DOM";

const initHTML = getBodyInnerHTML();

const game = Game();

const { self } = game;
const { rival } = game;

function gameLoop({ aiEnabled = false }) {
  let { currentTurn } = game.getTurn();
  let { nextTurn } = game.getTurn();
  if (aiEnabled) {
    currentTurn = self;
    nextTurn = rival;
  }

  const selfArgs = self.table.args;
  self.table = Table(selfArgs.tableSize, selfArgs.parentQuery);

  const rivalArgs = rival.table.args;
  rival.table = Table(rivalArgs.tableSize, rivalArgs.parentQuery);

  self.table.render();
  rival.table.render();

  self.table.update(self);
  rival.table.update(rival);

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
        return renderVictoryScreen(
          currentTurn.getName(),
          currentTurn.getId(),
          nextTurn.getId()
        );
    } else {
      return null;
    }
    if (!aiEnabled) {
      renderPassScreen(
        currentTurn.getName(),
        currentTurn.getId(),
        nextTurn.getName(),
        nextTurn.getId()
      );

      document.querySelector(".pass-btn").addEventListener("click", (e) => {
        nextTurn.setTurn(true);
        currentTurn.setTurn(false);
        setBodyInnerHTML(initHTML);
        gameLoop(aiEnabled);
      });
    } else {
      const attackableCoordinate = self.gameBrd
        .getMapData()
        .getRandomAttackableCoordinate();
      const aiAttack = self.gameBrd.receiveAttack([
        attackableCoordinate.x,
        attackableCoordinate.y,
      ]);
      console.log({ aiAttack });
      if (aiAttack !== null) {
        self.table.renderAttackResult(aiAttack, [
          attackableCoordinate.x,
          attackableCoordinate.y,
        ]);
        if (aiAttack.gameover)
          return renderVictoryScreen(
            rival.getName(),
            rival.getId(),
            self.getId()
          );
      } else {
        return null;
      }
    }
  });
}

gameLoop({ aiEnabled: true });
