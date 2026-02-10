import express from "express";
import { getStatuses, getStatusById } from "../controllers/statusController.js";
import { validateStatusIdParam } from "../middleware/validation.middleware.js";

const statusRouter = express.Router();

statusRouter.get("/", getStatuses);
statusRouter.get("/:statusId", validateStatusIdParam, getStatusById);

export default statusRouter;
