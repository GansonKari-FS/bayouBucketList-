import Experience from "../models/Experience.js";

// GET all experiences belonging to the logged-in user
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(experiences);
  } catch (error) {
    console.error("Get experiences error:", error);

    return res.status(500).json({
      message: "Unable to retrieve experiences.",
      error: error.message,
    });
  }
};

// GET one experience belonging to the logged-in user
export const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(200).json(experience);
  } catch (error) {
    console.error("Get experience error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(500).json({
      message: "Unable to retrieve the experience.",
      error: error.message,
    });
  }
};

// POST a new experience for the logged-in user
export const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create({
      ...req.body,
      user: req.user._id,
    });

    return res.status(201).json(experience);
  } catch (error) {
    console.error("Create experience error:", error);

    return res.status(400).json({
      message: "Unable to create the experience.",
      error: error.message,
    });
  }
};

// PUT or PATCH an experience belonging to the logged-in user
export const updateExperience = async (req, res) => {
  try {
    const allowedUpdates = {
      title: req.body.title,
      location: req.body.location,
      category: req.body.category,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      priority: req.body.priority,
      completed: req.body.completed,
    };

    // Remove fields that were not included in the request
    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    const experience = await Experience.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(200).json(experience);
  } catch (error) {
    console.error("Update experience error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(400).json({
      message: "Unable to update the experience.",
      error: error.message,
    });
  }
};

// DELETE an experience belonging to the logged-in user
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(200).json({
      message: "Experience deleted successfully.",
      experience,
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    if (error.name === "CastError") {
      return res.status(404).json({
        message: "Experience not found.",
      });
    }

    return res.status(500).json({
      message: "Unable to delete the experience.",
      error: error.message,
    });
  }
};
