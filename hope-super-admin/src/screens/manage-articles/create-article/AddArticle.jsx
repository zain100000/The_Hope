import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createArticle } from "../../../redux/slices/articles.slice";

import InputField from "../../../utilities/input-field/InputField.utility";
import Button from "../../../utilities/button/Button.utility";
import "./AddArticle.css";

const LIBRARY_CATEGORIES = [
  "STRESS",
  "ANXIETY",
  "DEPRESSION",
  "BIPOLAR_DISORDER",
  "PTSD",
  "OCD",
  "EATING_DISORDERS",
  "SELF_CARE",
  "SLEEP_HYGIENE",
  "MINDFULNESS",
  "MEDITATION",
  "NUTRITION",
  "EXERCISE",
  "EMOTIONAL_REGULATION",
  "RELATIONSHIPS",
  "SOCIAL_ANXIETY",
  "SELF_ESTEEM",
  "GRIEF_AND_LOSS",
  "ANGER_MANAGEMENT",
  "WORK_LIFE_BALANCE",
  "BURNOUT",
  "TIME_MANAGEMENT",
  "ACADEMIC_PRESSURE",
  "RESILIENCE",
  "MOTIVATION",
  "HABIT_BUILDING",
  "COGNITIVE_REFRAMING",
];

const AddArticle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Multi-Thumbnail State
  const [thumbnails, setThumbnails] = useState([]); // Array of { file, preview }
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 3 - thumbnails.length;

    if (files.length > availableSlots) {
      toast.error(`You can only add ${availableSlots} more image(s).`);
    }

    const newEntries = files.slice(0, availableSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setThumbnails((prev) => [...prev, ...newEntries]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    setThumbnails((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].preview); // Clean up memory
      return filtered;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!category) return toast.error("Select a category");
    if (thumbnails.length === 0)
      return toast.error("At least one thumbnail is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("content", content.trim());
      formData.append("readingTime", readingTime);
      formData.append("isPublished", isPublished);

      // Handle Tags
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      formData.append("tags", JSON.stringify(tagArray));

      // Append multiple files to the "thumbnail" key
      thumbnails.forEach((item) => {
        formData.append("thumbnail", item.file);
      });

      const result = await dispatch(createArticle(formData));

      if (createArticle.fulfilled.match(result)) {
        toast.success("Article published with gallery!");
        navigate("/super-admin/articles/manage-articles");
      } else {
        toast.error(result.payload?.message || "Publishing failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatLabel = (str) =>
    str
      .split("_")
      .map((w) => w[0] + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <section id="add-article" className="py-5">
      <div className="container">
        <div className="form-header text-center mb-5 animate-up">
          <h1 className="display-5 fw-bold text-gradient">Content Studio</h1>
          <p className="text-muted">Multi-media enabled article editor</p>
        </div>

        <div className="glass-card shadow-lg rounded-4">
          <div className="card-body p-4 p-lg-5">
            <form onSubmit={handleSubmit}>
              {/* Header Info */}
              <div className="row g-4 mb-4">
                <div className="col-lg-9">
                  <InputField
                    label="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    icon={<i className="fas fa-heading"></i>}
                    placeholder="Enter a captivating title..."
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Read Time (m)"
                    type="number"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    icon={<i className="fas fa-clock"></i>}
                  />
                </div>
              </div>

              {/* Categorization */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label custom-label">
                    Backend Category
                  </label>
                  <div className="select-container">
                    <select
                      className="form-select custom-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select Category...</option>
                      {LIBRARY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {formatLabel(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label custom-label">
                    Publishing Status
                  </label>
                  <div
                    className={`toggle-box ${isPublished ? "bg-active" : "bg-draft"}`}
                  >
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <label className="ms-2 fw-bold">
                        {isPublished ? "PUBLIC" : "DRAFT"}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Thumbnail Gallery Mechanism */}
              <div className="mb-5">
                <label className="form-label custom-label">
                  Thumbnails <span className="text-muted small">(Max 3)</span>
                </label>

                <div className="thumbnail-grid">
                  {thumbnails.map((item, index) => (
                    <div key={index} className="thumb-item animate-pop">
                      <img src={item.preview} alt="Preview" />
                      <button
                        type="button"
                        className="delete-overlay"
                        onClick={() => removeImage(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}

                  {thumbnails.length < 3 && (
                    <div
                      className="add-more-card"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <i className="fas fa-plus"></i>
                      <span>Add Image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="mb-4">
                <InputField
                  label="Article Body"
                  multiline
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Supports HTML tags for rich formatting..."
                />
              </div>

              <div className="mb-5">
                <InputField
                  label="Keywords / Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  icon={<i className="fas fa-tags"></i>}
                  placeholder="stress, anxiety, wellness (comma separated)"
                />
              </div>

              <div className="text-center pt-4 border-top">
                <Button
                  title={isPublished ? "Publish Article" : "Save as Draft"}
                  width={300}
                  loading={loading}
                  onPress={handleSubmit}
                  icon={<i className="fas fa-paper-plane me-2"></i>}
                  className="btn-submit-enhanced"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddArticle;
