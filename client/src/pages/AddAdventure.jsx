import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  title: "",
  location: "",
  category: "Nature & Outdoors",
  description: "",
  imageUrl: "",
  priority: "Medium",
  completed: false,
};

function AddAdventure() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
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

    try {
      await api.post("/experiences", formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Unable to save the adventure.");
    }
  };

  return (
    <main className="page-section">
      <div className="form-container">
        <p className="eyebrow">New Louisiana Experience</p>
        <h1>Add an Adventure</h1>
        <p>Add a place, event, meal, or experience you want to explore.</p>

        {error && <p className="error-message">{error}</p>}

        <form className="adventure-form" onSubmit={handleSubmit}>
          <label>
            Adventure title
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
              <option>Nature & Outdoors</option>
              <option>Food & Restaurants</option>
              <option>Festivals</option>
              <option>History & Culture</option>
              <option>Music & Nightlife</option>
              <option>Road Trips</option>
              <option>Hidden Gems</option>
              <option>Family Activities</option>
            </select>
          </label>

          <label>
            Priority
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
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

          <label className="full-width">
            Image URL
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
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

          <button type="submit" className="primary-button">
            Save Adventure
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddAdventure;
