'use strict';

function getDenominations(db) {
  return db('denominations').select('*');
}

module.exports = { getDenominations };
