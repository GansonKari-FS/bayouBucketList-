import express from "express";

import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Every experience route below this line requires a valid JWT.
router.use(protect);

router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.post("/", createExperience);
router.put("/:id", updateExperience);
router.patch("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;
