'use strict';

const safeCountService = {
  getAllSafeCounts(db) {
    return db('safe_count').select('*');
  },

  getSafeCountById(db, id) {
    return db('safe_count')
      .select('*')
      .where({ id });
  },

  insertSafeCount(db, newSafeCount) {
    return db
      .insert(newSafeCount)
      .into('safe_count')
      .returning('*');
  }
};

module.exports = safeCountService;
