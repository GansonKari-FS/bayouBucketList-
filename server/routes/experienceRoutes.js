import express from "express";

import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController.js";

const router = express.Router();

router.get("/", getExperiences);
router.get("/:id", getExperienceById);
router.post("/", createExperience);
router.put("/:id", updateExperience);
router.patch("/:id", updateExperience);
router.delete("/:id", deleteExperience);

export default router;
