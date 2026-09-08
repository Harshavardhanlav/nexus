const express = require("express");

const router = express.Router();

const {
   addCalendarDate,
   getCalendarDates,
   updateCalendarDate,
   deleteCalendarDate
} = require("../controllers/calenderController");

router.post("/add-date", addCalendarDate);

router.get("/", getCalendarDates);
router.delete("/:id", deleteCalendarDate);
router.put("/update/:id", updateCalendarDate);

module.exports = router;