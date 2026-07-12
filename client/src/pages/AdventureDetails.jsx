import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function AdventureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExperience = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this adventure.");
      } finally {
        setLoading(false);
      }
    };

    getExperience();
  }, [id]);

  const toggleCompleted = async () => {
    try {
      const response = await api.patch(`/experiences/${id}`, {
        completed: !experience.completed,
      });

      setExperience(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to update this adventure.");
    }
  };

  const deleteExperience = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this adventure?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/experiences/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Unable to delete this adventure.");
    }
  };

  if (loading) {
    return (
      <main className="page-section">
        <p>Loading adventure...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-section">
        <p className="error-message">{error}</p>
        <Link to="/">Return Home</Link>
      </main>
    );
  }

  if (!experience) return null;

  return (
    <main className="page-section">
      <article className="details-container">
        {experience.imageUrl && (
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="details-image"
          />
        )}

        <div className="details-content">
          <div className="card-badges">
            <span className="badge">{experience.category}</span>
            <span className="badge">{experience.priority} Priority</span>
            <span className="badge">
              {experience.completed ? "Completed" : "Not Completed"}
            </span>
          </div>

          <h1>{experience.title}</h1>

          <p className="location">{experience.location}</p>

          <p>{experience.description}</p>

          <p>
            <strong>Date added:</strong>{" "}
            {new Date(experience.created_at).toLocaleDateString()}
          </p>

          <div className="details-actions">
            <button className="primary-button" onClick={toggleCompleted}>
              {experience.completed
                ? "Mark as Not Completed"
                : "Mark as Completed"}
            </button>

            <button className="delete-button" onClick={deleteExperience}>
              Delete Adventure
            </button>

            <Link to="/" className="secondary-button">
              Back to Adventures
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

export default AdventureDetails;
