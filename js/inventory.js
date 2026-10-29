"use strict";
function collectKey(state) {
  state.keyVisible = false;
  state.inventory.key === true;
}
function hasKey(state) {
  return state.inventory.key === true;
}
