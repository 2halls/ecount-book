var express = require("express");
var router = express.Router();

router.post("/", function (req, res) {
  let obj = JSON.parse(req.body);
  console.log(obj);
  res.status(201);
  res.json(obj);
});

module.exports = router;
