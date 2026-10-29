"use strict";
function canAuthorize(state) {
  return state.systems.movement && !state.systems.inventory;
}
function validateCodes(values, codes) {
  return values.length === 3 && values.every((value, index) =>
    value.trim().toUpperCase() === codes[index]);
}
