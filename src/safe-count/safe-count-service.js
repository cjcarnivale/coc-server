'use strict';

const safeCountService = {
  getAllSafeCounts(db) {
    return db('safe_count').select('*');
  },

  insertSafeCount(db, newSafeCount) {
    return db
      .insert(newSafeCount)
      .into('safe_count')
      .returning('*'); 
  }
};

module.exports = safeCountService;
