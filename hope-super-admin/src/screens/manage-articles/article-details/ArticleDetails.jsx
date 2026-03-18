/**
 * @file ArticleDetails.jsx
 * @module Screens/Articles/ArticleDetails
 * @description
 * Beautiful, modern reading view for articles in the wellness library.
 * Optimized for long-form content with rich HTML rendering.
 */

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ArticleDetails.css";

const ArticleDetails = () => {
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = location.state?.article || null;
      setArticle(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [location.state]);

  if (loading) {
    return (
      <div id="article-detail" className="loading-state">
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div id="article-detail">
        <div className="not-found">
          <div className="emoji">📖</div>
          <h2>Article not found</h2>
          <p>The requested article could not be loaded.</p>
        </div>
      </div>
    );
  }

  const coverImage =
    article.thumbnail?.[0] ||
    "https://images.unsplash.com/photo-1518459031867-4c9ece8c0009?w=800";
  const isPublished = article.isPublished === true;

  return (
    <div id="article-detail">
      <div className="scroll-container">
        {/* Hero Header */}
        <header className="article-hero">
          <div className="hero-content">
            <h1 className="article-title">{article.title}</h1>
            <p className="article-subtitle">{article.category || "Wellness"}</p>

            <div className="article-meta-badges">
              <span className="badge category">{article.category}</span>
              <span
                className={`badge status ${isPublished ? "published" : "draft"}`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>
              <span className="badge reading-time">
                {article.readingTime || 5} min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="featured-image-wrapper">
          <img src={coverImage} alt={article.title} className="article-cover" />
        </div>

        {/* Quick Info Bar */}
        <div className="quick-info-bar">
          <div className="info-item">
            <span className="label">Written by</span>
            <span className="value">
              {article.addedBy?.userName || "Admin"}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Published on</span>
            <span className="value">
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Views</span>
            <span className="value">{article.viewCount || 0}</span>
          </div>
        </div>

        {/* Main Article Content */}
        <main className="article-content">
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </main>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="tags-section">
            <h3 className="tags-heading">Tags</h3>
            <div className="tags-container">
              {article.tags.map((tag, i) => (
                <span key={i} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetails;
