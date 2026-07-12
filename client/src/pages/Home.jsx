import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExperiences = async () => {
      try {
        const response = await api.get("/experiences");
        setExperiences(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load adventures.");
      } finally {
        setLoading(false);
      }
    };

    getExperiences();
  }, []);

  const completedCount = experiences.filter(
    (experience) => experience.completed,
  ).length;

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Explore the Pelican State</p>
          <h1>Discover Louisiana, one adventure at a time.</h1>
          <p>
            Save the places, foods, festivals, and hidden gems you want to
            experience across Louisiana.
          </p>

          <Link to="/add" className="primary-button">
            Add an Adventure
          </Link>
        </div>
      </section>

      <section className="page-section">
        <div className="stats-grid">
          <article className="stat-card">
            <span>Total Adventures</span>
            <strong>{experiences.length}</strong>
          </article>

          <article className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </article>

          <article className="stat-card">
            <span>Still Exploring</span>
            <strong>{experiences.length - completedCount}</strong>
          </article>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Your Bucket List</p>
            <h2>Saved adventures</h2>
          </div>

          <Link to="/add" className="secondary-button">
            Add New
          </Link>
        </div>

        {loading && <p>Loading adventures...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && experiences.length === 0 && (
          <div className="empty-state">
            <h3>Your bucket list is empty.</h3>
            <p>Add your first Louisiana adventure to get started.</p>
            <Link to="/add" className="primary-button">
              Add First Adventure
            </Link>
          </div>
        )}

        <div className="adventure-grid">
          {experiences.map((experience) => (
            <article className="adventure-card" key={experience._id}>
              {experience.imageUrl && (
                <img
                  src={experience.imageUrl}
                  alt={experience.title}
                  className="adventure-image"
                />
              )}

              <div className="adventure-card-body">
                <div className="card-badges">
                  <span className="badge">{experience.category}</span>
                  <span className="badge">{experience.priority}</span>
                </div>

                <h3>{experience.title}</h3>
                <p className="location">{experience.location}</p>
                <p>{experience.description}</p>

                <Link
                  to={`/experiences/${experience._id}`}
                  className="text-link"
                >
                  View Adventure
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
