const ActivityLog = require("../models/activityLogSchema");

// Create activity log entry
const createActivityLog = async (action, entityType, entityId, entityName, description) => {
  try {
    const log = await ActivityLog.create({
      action,
      entityType,
      entityId,
      entityName,
      description,
    });
    return log;
  } catch (err) {
    console.error("Error creating activity log:", err.message);
  }
};

// Get all activity logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
};
