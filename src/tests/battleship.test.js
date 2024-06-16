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
  const mapData = game.self.gameBrd.getMapData();
  expect(mapData.getCoordinateData([0, 5]).ship).toBeTruthy();
});

test("sink ship part", () => {
  const game = Game();
  game.self.gameBrd.placeShipPart([2, 7], Ship(3));
  game.self.gameBrd.receiveAttack([2, 7]);
  game.self.gameBrd.receiveAttack([2, 7]);
  game.self.gameBrd.receiveAttack([2, 7]);
  const mapData = game.self.gameBrd.getMapData();
  expect(mapData.getCoordinateData([2, 7]).ship.isSunk());
});

test("build multipart ship", () => {
  const game = Game();
  game.self.gameBrd.placeShip([0, 5], 4, "vertical");
  const mapData = game.self.gameBrd.getMapData();
  expect(
    mapData.getCoordinateData([0, 5]).ship &&
      mapData.getCoordinateData([0, 6]).ship &&
      mapData.getCoordinateData([0, 7]).ship &&
      mapData.getCoordinateData([0, 8]).ship
  ).toBeTruthy();
});

test("ship shares health across coordinates", () => {
  const game = Game();
  game.self.gameBrd.placeShip([0, 5], 4, "vertical");
  const mapData = game.self.gameBrd.getMapData();
  game.self.gameBrd.receiveAttack([0, 5]);
  game.self.gameBrd.receiveAttack([0, 6]);
  game.self.gameBrd.receiveAttack([0, 7]);
  game.self.gameBrd.receiveAttack([0, 8]);
  expect(mapData.getCoordinateData([0, 8]).ship.isSunk()).toBeTruthy();
});

test("ship disallows hitting the same spot", () => {
  const game = Game();
  game.self.gameBrd.placeShip([0, 5], 4, "vertical");
  const mapData = game.self.gameBrd.getMapData();
  game.self.gameBrd.receiveAttack([0, 5]);
  game.self.gameBrd.receiveAttack([0, 5]);
  game.self.gameBrd.receiveAttack([0, 5]);
  game.self.gameBrd.receiveAttack([0, 5]);
  expect(mapData.getCoordinateData([0, 8]).ship.isSunk()).toBeFalsy();
});
