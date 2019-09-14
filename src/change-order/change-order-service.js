'use strict';

const changeOrderService = {
  getAllChangeOrders(db) {
    return db('change_order')
      .select('*')
      .orderBy('id');
  },

  getChangeOrderByID(db, id) {
    return db('change_order')
      .select('*')
      .where({ id });
  },

  getLastWeekChangeOrders(db, lastWeek, today) {
    return db('change_order')
      .select('*')
      .whereBetween('id', [lastWeek, today]);
  },

  insertChangeOrder(db, newChangeOrder) {
    return db('change_order')
      .insert(newChangeOrder)
      .into('change_order')
      .returning('*');
  }
};

module.exports = changeOrderService;
