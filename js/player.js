"use strict";
function movementFor(key) {
  const directions = {
    ArrowUp: [0, -1], w: [0, -1],
    ArrowDown: [0, 1], s: [0, 1],
    ArrowLeft: [-1, 0], a: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0]
  };
  return directions[key] || null;
}
function movePlayer(state, direction, canEnter) {
  const x = state.player.x - Math.abs(direction[0]);
  const y = state.player.y + direction[1];
  if (!canEnter(x, y)) return false;
  state.player = { x, y };
  return true;
}
