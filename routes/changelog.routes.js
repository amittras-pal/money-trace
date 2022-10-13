const router = require("express").Router();
const authenticate = require("../middlewares/auth.middleware");

const {
  getChangelog,
  createChangelog,
} = require("../controllers/changelog.controller");

router
  .route("/")
  .get(authenticate, getChangelog)
  .post(authenticate, createChangelog);

module.exports = router;
