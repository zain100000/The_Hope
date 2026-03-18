/**
 * @file UpdateArticle.jsx
 * @module Screens/Articles/UpdateArticle
 * @description Super Admin interface to **edit/update** an existing Article
 */

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getArticleById,
  updateArticle,
} from "../../../redux/slices/articles.slice";

import InputField from "../../../utilities/input-field/InputField.utility";
import Button from "../../../utilities/button/Button.utility";
import productPlaceholder from "../../../assets/placeHolder/product-placeholder.jpg";
import "./UpdateArticle.css";

const UpdateArticle = () => {
  const { articleId } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedArticle, loading: sliceLoading } = useSelector(
    (state) => state.articles,
  );

  const thumbnailRef = useRef(null);

  // ── Form Fields ───────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ── Fetch data ───────────────────────────────────────────────
  useEffect(() => {
    if (articleId) {
      if (state?.article) {
        populateForm(state.article);
        setIsDataLoaded(true);
      } else {
        dispatch(getArticleById(articleId));
      }
    }
  }, [articleId, dispatch, state?.article]);

  useEffect(() => {
    if (selectedArticle && selectedArticle._id === articleId && !isDataLoaded) {
      populateForm(selectedArticle);
      setIsDataLoaded(true);
    }
  }, [selectedArticle, articleId, isDataLoaded]);

  const populateForm = (article) => {
    setTitle(article.title || "");
    setCategory(article.category || "");
    setContent(article.content || "");
    setTags(article.tags?.join(", ") || "");
    setReadingTime(article.readingTime?.toString() || "");
    setIsPublished(article.isPublished ?? true);

    if (article.thumbnail?.[0]) {
      setThumbnailPreview(article.thumbnail[0]);
    }
  };

  // ── Handlers ─────────────────────────────────────────────────
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(selectedArticle?.thumbnail?.[0] || null);
    if (thumbnailRef.current) thumbnailRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");
    if (!readingTime || isNaN(readingTime) || Number(readingTime) < 1) {
      return toast.error("Enter a valid reading time");
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("category", category.trim());
      formData.append("content", content.trim());
      formData.append("readingTime", readingTime.trim());
      formData.append("isPublished", isPublished);

      // Tags
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagArray));

      // Thumbnail (only if new file selected)
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const result = await dispatch(updateArticle({ articleId, formData }));

      if (updateArticle.fulfilled.match(result)) {
        toast.success("Article updated successfully!");
        navigate("/super-admin/articles/manage-articles");
      } else {
        toast.error(result.payload?.message || "Failed to update article");
      }
    } catch (err) {
      toast.error("Network or unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sliceLoading && !isDataLoaded) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <section id="update-article" className="py-5">
      <div className="container">
        <div className="update-header text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Update Article</h1>
          <p className="text-muted lead">
            Modify "{title || "this article"}" details
          </p>
        </div>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit} noValidate>
              {/* Title + Reading Time */}
              <div className="row g-4 mb-4">
                <div className="col-md-8">
                  <InputField
                    label="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    icon={<i className="fas fa-heading"></i>}
                    placeholder="Understanding Anxiety"
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Reading Time (minutes)"
                    type="number"
                    min="1"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    icon={<i className="fas fa-clock"></i>}
                  />
                </div>
              </div>

              {/* Category + Status */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <InputField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    icon={<i className="fas fa-tag"></i>}
                    placeholder="ANXIETY"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold d-block mb-2">
                    Status
                  </label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                    />
                    <label className="form-check-label fw-medium">
                      {isPublished ? "Published" : "Draft"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <InputField
                  label="Article Content (HTML supported)"
                  multiline
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  icon={<i className="fas fa-file-alt"></i>}
                  placeholder="Paste your full article content here..."
                />
              </div>

              {/* Tags */}
              <div className="mb-5">
                <InputField
                  label="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  icon={<i className="fas fa-tags"></i>}
                  placeholder="anxiety, mental health, wellness"
                />
              </div>

              {/* Thumbnail */}
              <div className="mb-5">
                <label className="form-label fw-bold d-block mb-2">
                  Thumbnail Image
                </label>

                {thumbnailPreview ? (
                  <div className="position-relative rounded-3 overflow-hidden shadow-sm">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-100 object-fit-cover"
                      style={{ height: "260px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={removeThumbnail}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div
                    className="upload-zone border border-dashed rounded-3 text-center p-5 bg-white"
                    onClick={() => thumbnailRef.current?.click()}
                  >
                    <img
                      src={productPlaceholder}
                      alt=""
                      width="80"
                      className="mb-3 opacity-75"
                    />
                    <p className="mb-1 fw-medium">
                      Click to upload new thumbnail
                    </p>
                  </div>
                )}

                <input
                  ref={thumbnailRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailChange}
                />
              </div>

              {/* Submit */}
              <div className="text-center mt-5 pt-4 border-top">
                <Button
                  title="Update Article"
                  width={280}
                  loading={loading}
                  onPress={handleSubmit}
                  icon={<i className="fas fa-save me-2"></i>}
                  disabled={loading}
                  className="btn-lg"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateArticle;
