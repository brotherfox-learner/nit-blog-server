import express from "express";
import { getStatuses, getStatusById } from "../controllers/statusController.js";
import { validateStatusIdParam } from "../middleware/validation.middleware.js";
import { protectAdmin } from "../middleware/auth.middleware.js";
const statusRouter = express.Router();

statusRouter.get("/", protectAdmin, getStatuses);
statusRouter.get("/:statusId", protectAdmin, validateStatusIdParam, getStatusById);

export default statusRouter;
