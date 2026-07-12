import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import imageMap from "../services/imageMap";

function AdventureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const getExperience = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
      } catch (err) {
        console.error("Error loading adventure:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load this adventure. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    getExperience();
  }, [id]);

  const toggleCompleted = async () => {
    setError("");
    setUpdating(true);

    try {
      const response = await api.patch(`/experiences/${id}`, {
        completed: !experience.completed,
      });

      setExperience(response.data);
    } catch (err) {
      console.error("Error updating adventure:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update this adventure. Please try again.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const deleteExperience = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this adventure?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      await api.delete(`/experiences/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting adventure:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete this adventure. Please try again.",
      );

      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="page-section">
        <div className="details-container">
          <p>Loading adventure...</p>
        </div>
      </main>
    );
  }

  if (error && !experience) {
    return (
      <main className="page-section">
        <div className="details-container">
          <p className="error-message">{error}</p>

          <Link to="/" className="secondary-button">
            Back to Adventures
          </Link>
        </div>
      </main>
    );
  }

  if (!experience) {
    return null;
  }

  const selectedImage = imageMap[experience.imageUrl] || imageMap.swamp;

  return (
    <main className="page-section">
      <article className="details-container">
        <img
          src={selectedImage}
          alt={experience.title}
          className="details-image"
        />

        <div className="details-content">
          <div className="card-badges">
            <span className="badge">{experience.category}</span>

            <span className="badge">{experience.priority} Priority</span>

            <span
              className={`badge ${
                experience.completed ? "completed-badge" : "pending-badge"
              }`}
            >
              {experience.completed ? "Completed" : "Not Completed"}
            </span>
          </div>

          <p className="eyebrow">Louisiana Adventure</p>

          <h1>{experience.title}</h1>

          <p className="location">{experience.location}</p>

          <p className="details-description">{experience.description}</p>

          <p className="date-added">
            <strong>Date added:</strong>{" "}
            {new Date(experience.created_at).toLocaleDateString()}
          </p>

          {error && <p className="error-message">{error}</p>}

          <div className="details-actions">
            <button
              type="button"
              className="primary-button"
              onClick={toggleCompleted}
              disabled={updating || deleting}
            >
              {updating
                ? "Updating..."
                : experience.completed
                  ? "Mark as Not Completed"
                  : "Mark as Completed"}
            </button>

            <Link
              to={`/experiences/${experience._id}/edit`}
              className="secondary-button"
            >
              Edit Adventure
            </Link>

            <button
              type="button"
              className="delete-button"
              onClick={deleteExperience}
              disabled={updating || deleting}
            >
              {deleting ? "Deleting..." : "Delete Adventure"}
            </button>

            <Link to="/" className="text-link">
              Back to Adventures
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export default AdventureDetails;
