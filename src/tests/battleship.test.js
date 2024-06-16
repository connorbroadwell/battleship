import { Game, Ship } from "../modules/battleship";

test.skip("get number of playable ships for game creation", () => {
  const { playableShips } = Game().getPlayableShips();
  expect(playableShips).toEqual([
    { howMany: 4, size: 1 },
    { howMany: 3, size: 2 },
    { howMany: 2, size: 3 },
    { howMany: 1, size: 4 },
  ]);
});

test.skip("valid board size", () => {
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

test("all ships are sunk", () => {
  const game = Game();
  game.self.gameBrd.placeShip([4, 7], 2, "horizontal");
  game.self.gameBrd.receiveAttack([4, 7]);
  game.self.gameBrd.receiveAttack([5, 7]);

  game.self.gameBrd.placeShip([9, 7], 1, "vertical");
  game.self.gameBrd.receiveAttack([9, 7]);

  expect(game.self.gameBrd.allShipsSunk()).toBeTruthy();
});

test.skip("is valid horizontal placement", () => {
  const game = Game();
  game.self.gameBrd.placeShip([2, 2], 4, "vertical");
  const result = game.self.gameBrd.getValidCoords("y", 4);
  expect(result).toEqual([0, 1, 2, 3]);
});
