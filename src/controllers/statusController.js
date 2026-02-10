import * as statusService from "../services/statusService.js";

/**
 * Controller Layer สำหรับ Status
 */

export const getStatuses = async (req, res, next) => {
  try {
    const result = await statusService.getStatuses();
    res.status(200).json(result);
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.message?.includes("connection")) {
      return res.status(500).json({ message: "Database connection error" });
    }
    next(error);
  }
};

export const getStatusById = async (req, res, next) => {
  try {
    const statusId = req.params.statusId ?? req.params.id;
    const status = await statusService.getStatusById(statusId);
    res.status(200).json(status);
  } catch (error) {
    if (error.message === "STATUS_NOT_FOUND") {
      return res.status(404).json({ message: "Status not found" });
    }
    next(error);
  }
};
