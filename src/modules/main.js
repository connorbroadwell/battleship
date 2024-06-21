import { Game } from "./battleship";
import {
  getBodyInnerHTML,
  renderNotification,
  renderPassScreen,
  renderVictoryScreen,
  setBodyInnerHTML,
  Table,
  renderGameStart,
  addGameInitBtnEventListener,
  renderPlayerLabels,
} from "./DOM";

const game = Game();

const { self } = game;
const { rival } = game;

function gameLoop({ aiEnabled = false }) {
  const initHTML = getBodyInnerHTML();
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

  if (!aiEnabled) {
    renderNotification(
      `It is <span class="${currentTurn.getId()}-victory">${currentTurn.getName()}'s</span> turn, click on <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}'s</span> board to attack`
    );
  } else {
    renderNotification(
      `<span class="${currentTurn.getId()}-victory">${currentTurn.getName()}</span> Is facing the A.I <span class="${nextTurn.getId()}-victory">${nextTurn.getName()}</span> Good luck!`
    );
  }

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

addGameInitBtnEventListener((e) => {
  let ai = { aiEnabled: false };
  for (let i = 0; i < e.currentTarget.form.children.length; i += 1) {
    const formItem = e.currentTarget.form[i];
    if (formItem.id === "self") {
      if (formItem.value !== "" && !(formItem.value.length >= 20)) {
        self.setName(formItem.value);
      } else {
        self.setName("John Battlefield");
      }
    }
    if (formItem.id === "rival") {
      if (formItem.value !== "" && !(formItem.value.length >= 20)) {
        rival.setName(formItem.value);
      } else {
        rival.setName("Rival");
      }
    }
    if (formItem.id === "ai-checkbox") {
      if (formItem.validity.valid) {
        ai = { aiEnabled: true };
        rival.setName(`${rival.getName()}.AI`);
      }
    }
    console.log(e.currentTarget.form[i]);

    setBodyInnerHTML(renderGameStart());
    renderPlayerLabels(self.getName(), rival.getName());
    gameLoop(ai);
  }
});
