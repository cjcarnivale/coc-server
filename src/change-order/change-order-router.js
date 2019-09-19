'use strict';

const express = require('express');
const changeOrderService = require('./change-order-service');
const safeCountService = require('../safe-count/safe-count-service');

const bodyParser = express.json();
const changeOrderRouter = express.Router();

const dayjs = require('dayjs');
const Joi = require('@hapi/joi');

changeOrderRouter.route('/')
  .post(bodyParser, async (req, res, next) => {
    try {
      const {
        date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives
      } = req.body;
      const newChangeOrder = {
        id: date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives

      };

      const schema = Joi.object({
        id: Joi.date(),
        quarters: Joi.number().integer(),
        dimes: Joi.number().integer(),
        nickles: Joi.number().integer(),
        pennies: Joi.number().integer(),
        ones: Joi.number().integer(),
        fives: Joi.number().integer(),
      });

      const validation = Joi.validate(newChangeOrder, schema);

      if (validation.error) {
        return res.status(400).json({
          error: 'All inputs must be whole numbers and date must be valid'
        });
      }

      const safeCount = await changeOrderService.insertChangeOrder(
        req.app.get('db'),
        newChangeOrder
      );

      let cleanCount = await safeCountService.sanitizeData(safeCount);
      res.status(201).json(cleanCount);
      next();
    } catch (error) {
      if (error.constraint === 'safe_count_pkey') {
        return res
          .status(400)
          .json({ error: 'A count for that day has been entered already' });
      }
      next(error);
    }
  });

changeOrderRouter.route('/:id').get(async (req, res, next) => {
  try {
    let changeOrder = await changeOrderService.getChangeOrderByID(
      req.app.get('db'),
      req.params.id
    );
    let cleanCount = safeCountService.sanitizeData(changeOrder);
    return res.status(200).json(cleanCount);
  } catch (error) {
    next(error);
  }
});

changeOrderRouter.route('/generatecount/:id').get(async (req, res, next) => {
  try {
    let todaySafeCount = await safeCountService.getSafeCountById(
      req.app.get('db'),
      req.params.id
    );
    if (todaySafeCount.length === 0) {
      return res.status(404).json({error: 'Today\'s safe count not entered'});
    }

    const changeOrderDenominations = [
      'quarters',
      'dimes',
      'nickles',
      'pennies',
      'ones',
      'fives'
    ];

    let lastWeekSafeCount = await safeCountService.getSafeCountById(
      req.app.get('db'),
      dayjs(req.params.id).subtract(7, 'day')
    );
    if (lastWeekSafeCount.length === 0) {
      return res
        .status(404)
        .json({ error: 'Last week\'s safe count not entered' });
    }

    let lastWeekChangeOrders = await changeOrderService.getLastWeekChangeOrders(
      req.app.get('db'),
      dayjs(req.params.id).subtract(7, 'day'),
      req.params.id
    );

    let combinedLastWeekChangeOrders = {
      quarters: 0,
      dimes: 0,
      nickles: 0,
      pennies: 0,
      ones: 0,
      fives: 0
    };

    lastWeekChangeOrders = changeOrderDenominations.forEach(den => {
      lastWeekChangeOrders.forEach(
        order =>
          (combinedLastWeekChangeOrders[den] = (
            combinedLastWeekChangeOrders[den] + parseInt(order[den])
          ).toString())
      );
    });

    let newChangeOrder = [];
    let newChangeOrderDetails = {};
    newChangeOrderDetails.date = todaySafeCount[0]['id'];

    changeOrderDenominations.forEach(den => {
      let diff =
        parseInt(lastWeekSafeCount[0][den]) +
        parseInt(combinedLastWeekChangeOrders[den]) -
        parseInt(todaySafeCount[0][den]);
      newChangeOrderDetails[den] = diff.toString();
    });

    let negativeCheck = Object.values(newChangeOrderDetails)
      .map(value => parseInt(value))
      .filter(value => {
        if (value < 0) {
          return value;
        }
      });
    if (negativeCheck.length > 0) {
      return res.status(400).json({ error: 'Negative usage encountered' });
    }

    newChangeOrder.push(newChangeOrderDetails);

    let cleanCount = safeCountService.sanitizeData(newChangeOrder);
    return res.status(200).json(cleanCount);
  } catch (error) {
    next(error);
  }
});

module.exports = changeOrderRouter;
