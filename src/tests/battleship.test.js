import { Game, Ship } from "../modules/battleship";

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

test("place ship part", () => {
  const game = Game();
  game.self.gameBrd.placeShipPart([0, 5], Ship(1));
  const map = game.self.gameBrd.getMap();
  expect(map.getCoordinateData([0, 5]).ship).toBeTruthy();
});

test("sink ship part", () => {
  const game = Game();
  game.self.gameBrd.placeShipPart([2, 7], Ship(3));
  game.self.gameBrd.receiveAttack([2, 7]);
  game.self.gameBrd.receiveAttack([2, 7]);
  game.self.gameBrd.receiveAttack([2, 7]);
  const map = game.self.gameBrd.getMap();
  expect(map.getCoordinateData([2, 7]).ship.isSunk());
});

test("build multipart ship", () => {
  const game = Game();
  const ship = Ship(4);
  game.self.gameBrd.placeShip([0, 5], 4);
  const map = game.self.gameBrd.getMap();
  expect(map.getCoordinateData([0, 5]).ship.isSunk());
});
