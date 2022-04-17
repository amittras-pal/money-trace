const router = require("express").Router();
const { getCategories } = require("../controllers/category.controller");

router.get("/", getCategories);

module.exports = router;
