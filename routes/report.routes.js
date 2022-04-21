const router = require("express").Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getReportDetails,
} = require("../controllers/report.controller");
const authenticate = require("../middlewares/auth.middleware");

router.get("/details", authenticate, getReportDetails);
router
  .route("/")
  .get(authenticate, getReports)
  .post(authenticate, createReport)
  .put(authenticate, updateReport)
  .delete(authenticate, deleteReport);

module.exports = router;
