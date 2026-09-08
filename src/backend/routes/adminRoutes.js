const express = require("express");
const router = express.Router();
const {createAdmin, adminLogin, checkAdmin} = require("../controllers/adminController")
router.post("/create-admin",createAdmin);
router.post("/admin-login",adminLogin);
router.get("/check-admin", checkAdmin);
module.exports = router;

