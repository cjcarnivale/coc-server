'use strict';
const denominationService = {
  getSafeCountDenominations(db) {
    return db('denominations').select('*');
  },

  getChangeOrderDenominations(db) {
    return db('denominations')
      .select('*')
      .where('change_order', true);
  }
};

module.exports = denominationService;
