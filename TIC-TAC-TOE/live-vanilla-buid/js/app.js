//imports to two other javascript classes
import Store from "./store.js";
import View from "./view.js";

//array of player 1 and 2 configurations
const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "blue",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "orange",
  },
];

function init() {
  //call view and store
  const view = new View();
  const store = new Store("live-t3-storage-key", players);

  //curent tab state changed
  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  //different tab state changes
  window.addEventListener("storage", () => {
    console.log("State changed from another tab");
    view.render(store.game, store.stats);
  });

  //first load of the document
  view.render(store.game, store.stats);

  //game reset button
  view.bindGameResetEvent((event) => {
    store.reset();
  });

  //round reset button
  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  //gameboard moves buttons
  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find(
      (move) => move.squareId === +square.id
    );

    if (existingMove) {
      return;
    }

    //Advance to the next state by pushing a move to the moves array
    store.playerMove(+square.id);
  });
}

//load content to window
window.addEventListener("load", init);
