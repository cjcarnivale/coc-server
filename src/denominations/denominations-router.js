"use strict";

const express = require("express");
const DenominationService = require("./denominations-service");

const denominationsRouter = express.Router();

denominationsRouter.route("/safecounts").get(async (req, res, next) => {
  try {
    const denominations = await DenominationService.getSafeCountDenominations(req.app.get("db"));
    res.status(200).json(denominations);
    next();
  } catch (error) {
    next(error);
  }
});

denominationsRouter.route("/changeorders").get(async (req, res, next) => {
  try {
    const denominations = await DenominationService.getChangeOrderDenominations(req.app.get("db"));
    res.status(200).json(denominations);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = denominationsRouter;
