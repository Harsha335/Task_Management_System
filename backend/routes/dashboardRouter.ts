import { Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { getCompletedProjectsAndTasks, getProjectStatus } from "../controllers/dashboardController";

const router = Router();

router.get("/projectStatus", verifyUser, getProjectStatus);
router.get("/projectAndTask_track", verifyUser, getCompletedProjectsAndTasks);

export default router;