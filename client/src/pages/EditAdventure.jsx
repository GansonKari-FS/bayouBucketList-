import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

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

function EditAdventure() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "Nature & Outdoors",
    description: "",
    imageUrl: "swamp",
    priority: "Medium",
    completed: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdventure = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);

        setFormData({
          title: response.data.title || "",
          location: response.data.location || "",
          category: response.data.category || "Nature & Outdoors",
          description: response.data.description || "",
          imageUrl: response.data.imageUrl || "swamp",
          priority: response.data.priority || "Medium",
          completed: response.data.completed || false,
        });
      } catch (err) {
        console.error("Error loading adventure:", err);

        setError(
          err.response?.data?.message || "Unable to load this adventure.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAdventure();
  }, [id]);

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
      await api.put(`/experiences/${id}`, formData);
      navigate(`/experiences/${id}`);
    } catch (err) {
      console.error("Error updating adventure:", err);

      setError(
        err.response?.data?.message || "Unable to update this adventure.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-section">
        <p>Loading adventure...</p>
      </main>
    );
  }

  return (
    <main className="page-section">
      <div className="form-container">
        <p className="eyebrow">Update Louisiana Experience</p>

        <h1>Edit Adventure</h1>

        <p className="form-intro">
          Update the details for this bucket list adventure.
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
            This adventure is completed
          </label>

          <div className="form-actions full-width">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(`/experiences/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditAdventure;
