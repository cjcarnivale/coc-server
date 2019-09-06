'use strict';
const xss = require('xss');

const safeCountService = {
  getAllSafeCounts(db) {
    return db('safe_count')
      .select('*')
      .orderBy('id');
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
  },

  updateSafeCount(db, newCount, id) {
    return db('safe_count')
      .where({ id })
      .update(newCount)
      .returning('*');
  },

  deleteSafeCount(db, id) {
    return db('safe_count')
      .where({ id })
      .delete();
  },

  sanitizeData(counts) {
    let clean = counts.map(count => {
      let cleanCount = {};
      for (let key in count) {
        cleanCount[xss(key)] = xss(count[key]);
      }
      return cleanCount;
    });
    return clean;
  }
};

module.exports = safeCountService;
