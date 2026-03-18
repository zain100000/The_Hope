import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Yoga.guide.details.css";

/**
 * YogaGuideDetails – Enhanced Wellness View
 * Modern, calm, spacious layout optimized for yoga & mindfulness content
 */
const YogaGuideDetails = () => {
  const location = useLocation();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("instructions");

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = location.state?.guide || null;
      setGuide(data);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [location.state]);

  if (loading) {
    return (
      <div id="yoga-guide-detail" className="loading-state">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading your yoga journey...</p>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div id="yoga-guide-detail">
        <div className="not-found">
          <div className="emoji">🧘‍♀️</div>
          <h2>No yoga guide found</h2>
          <p>The selected practice could not be loaded.</p>
        </div>
      </div>
    );
  }

  const hasVideo = !!guide.video;
  const hasInstructions = Array.isArray(guide.instructions) && guide.instructions.length > 0;
  const hasBenefits = Array.isArray(guide.benefits) && guide.benefits.length > 0;

  return (
    <div id="yoga-guide-detail">
      <div className="scroll-container">
        {/* Hero / Header */}
        <header className="guide-hero">
          <div className="hero-content">
            <h1 className="guide-title">{guide.title}</h1>
            <p className="guide-subtitle">{guide.description}</p>

            <div className="guide-meta-badges">
              <span className="badge category">{guide.category || "Yoga"}</span>
              <span className={`badge difficulty ${guide.difficultyLevel?.toLowerCase()}`}>
                {guide.difficultyLevel || "—"}
              </span>
              <span className={`badge status ${guide.isActive ? "active" : "inactive"}`}>
                {guide.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </header>

        {/* Media + Quick Stats */}
        <section className="media-and-stats">
          <div className="media-wrapper">
            {hasVideo ? (
              <video
                controls
                preload="metadata"
                poster={guide.coverImage}
                className="guide-video"
              >
                <source src={guide.video} type="video/mp4" />
                <source src={guide.video} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="image-fallback">
                <img
                  src={guide.coverImage || "https://images.unsplash.com/photo-1518459031867-4c9ece8c0009?w=800"}
                  alt={guide.title}
                  className="guide-cover"
                />
                <div className="no-video-overlay">
                  <span>No demo video available</span>
                </div>
              </div>
            )}
          </div>

          <div className="quick-stats-card">
            <div className="stat-item">
              <span className="stat-label">Duration</span>
              <span className="stat-value">{guide.durationMinutes || "?"} min</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Level</span>
              <span className="stat-value">{guide.difficultyLevel || "—"}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Steps</span>
              <span className="stat-value">{guide.instructions?.length || 0}</span>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav className="guide-tabs">
          <button
            className={`tab-btn ${activeTab === "instructions" ? "active" : ""}`}
            onClick={() => setActiveTab("instructions")}
            aria-selected={activeTab === "instructions"}
          >
            <i className="fas fa-list-ol"></i>
            Instructions
            <span className="count">{guide.instructions?.length || 0}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "benefits" ? "active" : ""}`}
            onClick={() => setActiveTab("benefits")}
            aria-selected={activeTab === "benefits"}
          >
            <i className="fas fa-heart"></i>
            Benefits
          </button>
        </nav>

        {/* Main Content */}
        <main className="guide-main-content">
          {/* Instructions */}
          {activeTab === "instructions" && (
            <section className="instructions-section">
              <h2 className="section-heading">How to Practice</h2>

              {hasInstructions ? (
                <ol className="step-timeline">
                  {guide.instructions
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map((step) => (
                      <li key={step._id || step.stepNumber} className="timeline-step">
                        <div className="step-marker">{step.stepNumber}</div>
                        <div className="step-content">
                          <p>{step.text}</p>
                          {step.stepImageUrl && (
                            <img
                              src={step.stepImageUrl}
                              alt={`Step ${step.stepNumber}`}
                              className="step-image"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </li>
                    ))}
                </ol>
              ) : (
                <div className="empty-state">
                  <p>No step-by-step instructions available for this guide.</p>
                </div>
              )}
            </section>
          )}

          {/* Benefits & Equipment */}
          {activeTab === "benefits" && (
            <section className="benefits-section">
              <div className="benefits-grid">
                {hasBenefits && (
                  <div className="benefit-column">
                    <h2 className="section-heading">Benefits</h2>
                    <ul className="benefit-list">
                      {guide.benefits.map((benefit, i) => (
                        <li key={i}>
                          <i className="fas fa-check-circle"></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="benefit-column">
                  <h2 className="section-heading">Equipment Needed</h2>
                  {guide.equipmentNeeded?.length > 0 ? (
                    <div className="equipment-tags">
                      {guide.equipmentNeeded.map((item, i) => (
                        <span key={i} className="equipment-tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-equipment">No special equipment required</p>
                  )}

                  {guide.targetAreas?.length > 0 && (
                    <>
                      <h3 className="subsection-heading mt-4">Target Areas</h3>
                      <div className="target-tags">
                        {guide.targetAreas.map((area, i) => (
                          <span key={i} className="target-tag">
                            {area}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default YogaGuideDetails;