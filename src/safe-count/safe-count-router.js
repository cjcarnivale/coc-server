'use strict';

const express = require('express');
const safeCountService = require('./safe-count-service');
const Joi = require('@hapi/joi');

const bodyParser = express.json();
const safeCountRouter = express.Router();

safeCountRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const safeCounts = await safeCountService.getAllSafeCounts(
        req.app.get('db')
      );
      let cleanCounts = await safeCountService.sanitizeData(safeCounts);
      res.status(200).json(cleanCounts);
    } catch (error) {
      next(error);
    }
  })
  .post(bodyParser, async (req, res, next) => {
    try {
      const {
        date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives,
        tens,
        twenties,
        fifties,
        hundreds
      } = req.body;
      const newSafeCount = {
        id: date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives,
        tens,
        twenties,
        fifties,
        hundreds
      };

      const schema = Joi.object({
        id: Joi.date(),
        quarters: Joi.number().integer(),
        dimes: Joi.number().integer(),
        nickles: Joi.number().integer(),
        pennies: Joi.number().integer(),
        ones: Joi.number().integer(),
        fives: Joi.number().integer(),
        tens: Joi.number().integer(),
        twenties: Joi.number().integer(),
        fifties: Joi.number().integer(),
        hundreds: Joi.number().integer()
      });

      const validation = Joi.validate(newSafeCount, schema);

      if (validation.error) {
        return res.status(400).json({
          error: 'All inputs must be whole numbers and date must be valid'
        });
      }

      const safeCount = await safeCountService.insertSafeCount(
        req.app.get('db'),
        newSafeCount
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

safeCountRouter
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      let safeCount = await safeCountService.getSafeCountById(
        req.app.get('db'),
        req.params.id
      );
      let cleanCount = await safeCountService.sanitizeData(safeCount);
      return res.status(200).json(cleanCount);
    } catch (error) {
      next(error);
    }
  })
  .patch(bodyParser, async (req, res, next) => {
    try {
      const {
        date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives,
        tens,
        twenties,
        fifties,
        hundreds
      } = req.body;
      const newCount = {
        id: date,
        quarters,
        dimes,
        nickles,
        pennies,
        ones,
        fives,
        tens,
        twenties,
        fifties,
        hundreds
      };

      const schema = Joi.object({
        id: Joi.date(),
        quarters: Joi.number().integer(),
        dimes: Joi.number().integer(),
        nickles: Joi.number().integer(),
        pennies: Joi.number().integer(),
        ones: Joi.number().integer(),
        fives: Joi.number().integer(),
        tens: Joi.number().integer(),
        twenties: Joi.number().integer(),
        fifties: Joi.number().integer(),
        hundreds: Joi.number().integer()
      });

      const validation = Joi.validate(newCount, schema);

      if (validation.error) {
        return res
          .status(400)
          .json({
            error: 'All inputs must be whole numbers and date must be vaild'
          });
      }

      await safeCountService.updateSafeCount(
        req.app.get('db'),
        newCount,
        req.params.id
      );
      res.status(204).end();
      next();
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await safeCountService.deleteSafeCount(req.app.get('db'), req.params.id);
      res.status(204).end();
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = safeCountRouter;
