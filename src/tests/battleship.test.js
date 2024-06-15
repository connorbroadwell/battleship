import { Game } from "../modules/battleship";

test("get number of playable ships for game creation", () => {
  const { playableShips } = Game().getPlayableShips();
  expect(playableShips).toEqual({
    oneShip: 4,
    twoShip: 3,
    threeShip: 2,
    fourShip: 1,
  });
});

test("valid board size", () => {
  const game = Game();
  const selfSize = game.self.gameBrd.getSize();
  const rivalSize = game.rival.gameBrd.getSize();
  if (selfSize === rivalSize) {
    expect(game.getPlayableShips().total === selfSize).toBeTruthy();
  }
});
