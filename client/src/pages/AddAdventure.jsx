import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  title: "",
  location: "",
  category: "Nature & Outdoors",
  description: "",
  imageUrl: "swamp",
  priority: "Medium",
  completed: false,
};

const imageOptions = [
  { label: "Louisiana Swamp", value: "swamp" },
  { label: "New Orleans", value: "newOrleans" },
  { label: "Baton Rouge", value: "batonRouge" },
  { label: "Historic Church", value: "church" },
  { label: "Historic Plantation", value: "plantation" },
  { label: "Mardi Gras", value: "mardiGrass" },
  { label: "Louisiana Music", value: "music" },
  { label: "Louisiana Scenic View", value: "hero" },
];

function AddAdventure() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await api.post("/experiences", formData);
      navigate("/");
    } catch (err) {
      console.error("Error creating adventure:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save the adventure. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-section">
      <div className="form-container">
        <p className="eyebrow">New Louisiana Experience</p>

        <h1>Add an Adventure</h1>

        <p className="form-intro">
          Add a place, event, restaurant, festival, or experience you want to
          explore in Louisiana.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form className="adventure-form" onSubmit={handleSubmit}>
          <label>
            Adventure Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Take a swamp tour"
              required
            />
          </label>

          <label>
            Location
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Atchafalaya Basin"
              required
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Nature & Outdoors">Nature & Outdoors</option>
              <option value="Food & Restaurants">Food & Restaurants</option>
              <option value="Festivals">Festivals</option>
              <option value="History & Culture">History & Culture</option>
              <option value="Music & Nightlife">Music & Nightlife</option>
              <option value="Road Trips">Road Trips</option>
              <option value="Hidden Gems">Hidden Gems</option>
              <option value="Family Activities">Family Activities</option>
            </select>
          </label>

          <label>
            Priority
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="full-width">
            Choose an Image
            <select
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            >
              {imageOptions.map((image) => (
                <option key={image.value} value={image.value}>
                  {image.label}
                </option>
              ))}
            </select>
          </label>

          <label className="full-width">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe what makes this adventure worth adding to your bucket list."
              required
            />
          </label>

          <label className="checkbox-row full-width">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
            />
            I have already completed this adventure
          </label>

          <div className="form-actions full-width">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/")}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Adventure"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default AddAdventure;
