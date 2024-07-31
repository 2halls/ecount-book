var express = require("express");
var router = express.Router();
const ApiResponse = require("../models/ApiResponse");

router.post("/", function (req, res) {
  const form = JSON.parse(JSON.stringify(req.body));
  console.log(form);
  res.status(201);
  res.json(new ApiResponse(201, "Created", "가계부 입력 성공", null));
});

module.exports = router;
