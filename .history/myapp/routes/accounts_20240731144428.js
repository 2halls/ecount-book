var express = require("express");
var router = express.Router();

router.post("/accounts", function (req, res) {
  let obj = JSON.parse(req.body);
});

module.exports = router;
