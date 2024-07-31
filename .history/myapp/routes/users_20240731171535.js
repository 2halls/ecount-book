var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
  res.json(new ApiResponse(201, "Created", "가계부 입력 성공", null));
});

module.exports = router;
