"use strict";

const express = require("express");
const { getDenominations } = require("./denominations-service");

const denominationsRouter = express.Router();

denominationsRouter.route("/").get(async (req, res, next) => {
  try {
    const denominations = await getDenominations(req.app.get("db"));
    res.status(200).json(denominations);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = denominationsRouter;
