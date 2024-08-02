var express = require("express");
var router = express.Router();
const db = require("../infrastructure/MemoryDB");
const ApiResponse = require("../models/ApiResponse");

router.get("/", function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  const data = db.fetchStatement(year + "-" + month);
  res.status(200);
  res.json(new ApiResponse(200, "손익계산서 조회 성공", data));
});

module.exports = router;
