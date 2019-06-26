"use strict";

const express = require("express");
const safeCountService = require("./safe-count-service");

const bodyParser = express.json();
const safeCountRouter = express.Router();

safeCountRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const safeCounts = await safeCountService.getAllSafeCounts(
        req.app.get("db")
      );
      res.status(200).json(safeCounts);
      next();
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

      const safeCount = await safeCountService.insertSafeCount(
        req.app.get("db"),
        newSafeCount
      );

      res.status(201).json(safeCount);
      next();
    } catch (error) {
      next(error);
    }
  });
safeCountRouter.route("/:id").get(async (req, res, next) => {
  try {
    const safeCount = await safeCountService.getSafeCountById(
      req.app.get("db"),
      req.params.id
    );
    if (safeCount.length === 0) {
      return res
        .status(404)
        .json({ errors: [`Safe count for that day doesn't exist`] });
    }
    return res.status(200).json(safeCount);
  } catch (error) {
    next(error);
  }
});

module.exports = safeCountRouter;
