var express = require("express");
var router = express.Router();
const ApiResponse = require("../models/ApiResponse");
const Account = require("../models/Account");
const db = require("../infrastructure/MemoryDB");

router.post("/", function (req, res) {
  const form = JSON.parse(JSON.stringify(req.body));
  const { date, time, bank, category, amount, content, transactionType } = form;
  const newAccount = new Account(date, time, bank, category, amount, content, transactionType);
  console.log(newAccount);
  db.add(newAccount.getDateInfo, newAccount);
  console.log(db);
  res.status(201);
  res.json(new ApiResponse(201, "Created", "가계부 입력 성공", null));
});

module.exports = router;
