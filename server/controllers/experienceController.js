import Experience from "../models/Experience.js";

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ created_at: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve experiences.",
      error: error.message,
    });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve the experience.",
      error: error.message,
    });
  }
};

export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Unable to create the experience.",
      error: error.message,
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(400).json({
      message: "Unable to update the experience.",
      error: error.message,
    });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }

    res.status(200).json({
      message: "Experience deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete the experience.",
      error: error.message,
    });
  }
};
