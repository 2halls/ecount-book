var express = require("express");
var router = express.Router();
const ApiResponse = require("../models/ApiResponse");
const Account = require("../models/Account");
const db = require("../infrastructure/MemoryDB");

router.post("/", function (req, res) {
  const form = JSON.parse(JSON.stringify(req.body));
  const { date, time, bank, category, amount, content, transactionType } = form;
  const newAccount = new Account(date, time, bank, category, amount, content, transactionType);
  db.add(newAccount.getDate(), newAccount);
  res.status(201);
  res.json(new ApiResponse(201, "Created", "가계부 입력 성공", null));
});

router.get("/", function (req, res) {
  const year = req.query.year;
  const month = req.query.month;
  const data = db.fetchAccounts(year, month);
  console.log(data);
  res.status(200);
  res.json(new ApiResponse(200, "OK", "가계부 조회 성공", data));
});

module.exports = router;
