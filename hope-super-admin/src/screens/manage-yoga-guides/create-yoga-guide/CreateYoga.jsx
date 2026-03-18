/**
 * @file AddYogaGuide.jsx
 * @module Screens/Yoga/AddYogaGuide
 * @description
 * The interface for Super Admins to add new yoga guides to the library.
 *
 * **Key Capabilities:**
 * - Form Handling for yoga pose/sequence details (title, description, category, difficulty, duration, benefits, target areas, equipment).
 * - Dynamic step-by-step instructions builder (add/remove steps).
 * - Single cover image upload (required) + optional demo video upload with live preview.
 * - Client-side validation with toast feedback.
 * - FormData submission to Redux + navigation on success.
 *
 * @requires react-redux
 * @requires react-router-dom
 * @requires react-hot-toast
 */

import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { createYogaGuide } from "../../../redux/slices/yoga.slice";

import InputField from "../../../utilities/input-field/InputField.utility";
import Button from "../../../utilities/button/Button.utility";

import productPlaceholder from "../../../assets/placeHolder/product-placeholder.jpg";
import "./CreateYoga.css";

const CreateYoga = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // ── Form fields ───────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("HATHA");
  const [difficultyLevel, setDifficultyLevel] = useState("BEGINNER");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [benefits, setBenefits] = useState("");
  const [targetAreas, setTargetAreas] = useState("");
  const [equipmentNeeded, setEquipmentNeeded] = useState("");

  const [instructions, setInstructions] = useState([""]);

  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [videoPreviewName, setVideoPreviewName] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // ── Instructions handlers ────────────────────────────────────
  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index) => {
    if (instructions.length <= 1) return;
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  // ── Media handlers ───────────────────────────────────────────
  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    setVideoFile(file);
    setVideoPreviewName(file.name);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreviewName("");
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleUploadYogaGuide = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title is required");
    if (!description.trim()) return toast.error("Description is required");
    if (
      !durationMinutes ||
      isNaN(durationMinutes) ||
      Number(durationMinutes) < 1
    ) {
      return toast.error("Enter a valid duration (minutes)");
    }
    if (!coverFile) return toast.error("Cover image is required");

    const cleanedInstructions = instructions
      .map((text) => text.trim())
      .filter(Boolean);

    if (cleanedInstructions.length === 0) {
      return toast.error("At least one instruction step is required");
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("difficultyLevel", difficultyLevel);
      formData.append("durationMinutes", durationMinutes.trim());

      const parseArray = (str) =>
        str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      formData.append("benefits", JSON.stringify(parseArray(benefits)));
      formData.append("targetAreas", JSON.stringify(parseArray(targetAreas)));
      formData.append(
        "equipmentNeeded",
        JSON.stringify(parseArray(equipmentNeeded)),
      );

      formData.append(
        "instructions",
        JSON.stringify(
          cleanedInstructions.map((text, idx) => ({
            stepNumber: idx + 1,
            text,
          })),
        ),
      );

      if (coverFile) formData.append("coverImage", coverFile);
      if (videoFile) formData.append("video", videoFile);

      const result = await dispatch(createYogaGuide(formData));

      if (createYogaGuide.fulfilled.match(result)) {
        toast.success("Yoga guide created successfully!");
        navigate("/super-admin/yoga-guides/manage-guides");
      } else {
        toast.error(result.payload?.message || "Failed to create yoga guide");
      }
    } catch (err) {
      toast.error("Network or unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="upload-yoga">
      <div className="upload-yoga-container">
        <div className="upload-yoga-header">
          <h1 className="upload-yoga-title">Add Yoga Guide</h1>
          <p className="upload-yoga-subtitle">
            Create a new yoga pose or sequence for the library
          </p>
        </div>

        <section className="upload-yoga-form-section">
          <div className="container">
            <form onSubmit={handleUploadYogaGuide} noValidate>
              {/* Title + Duration */}
              <div className="row g-4">
                <div className="col-md-8">
                  <InputField
                    label="Pose / Sequence Name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    icon={<i className="fas fa-spa"></i>}
                    placeholder="e.g. Surya Namaskar (Sun Salutation)"
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Duration (minutes)"
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    icon={<i className="fas fa-clock"></i>}
                  />
                </div>
              </div>

              {/* Category + Difficulty */}
              <div className="row g-4 mt-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="HATHA">Hatha</option>
                    <option value="VINYASA">Vinyasa</option>
                    <option value="ASHTANGA">Ashtanga</option>
                    <option value="YIN">Yin</option>
                    <option value="RESTORATIVE">Restorative</option>
                    <option value="POWER">Power</option>
                    <option value="KUNDALINI">Kundalini</option>
                    <option value="CHAIR_YOGA">Chair Yoga</option>
                    <option value="PRENATAL">Prenatal</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Difficulty Level
                  </label>
                  <select
                    className="form-select"
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <InputField
                  label="Description"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  icon={<i className="fas fa-align-left"></i>}
                  placeholder="Describe the yoga practice, purpose, precautions..."
                />
              </div>

              {/* Comma-separated arrays */}
              <div className="row g-4 mt-4">
                <div className="col-md-4">
                  <InputField
                    label="Benefits (comma separated)"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    icon={<i className="fas fa-heart text-danger"></i>}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Target Areas (comma separated)"
                    value={targetAreas}
                    onChange={(e) => setTargetAreas(e.target.value)}
                    icon={<i className="fas fa-bullseye text-primary"></i>}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Equipment Needed (comma separated)"
                    value={equipmentNeeded}
                    onChange={(e) => setEquipmentNeeded(e.target.value)}
                    icon={<i className="fas fa-toolbox text-warning"></i>}
                  />
                </div>
              </div>

              {/* Instructions Builder */}
              <div className="instructions-builder mt-5 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="fas fa-list-ol me-2 text-primary"></i>
                    Step-by-Step Instructions
                  </h5>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm px-3"
                    onClick={addInstruction}
                  >
                    <i className="fas fa-plus me-1"></i> Add Step
                  </button>
                </div>

                <div className="instruction-wrapper border rounded-3 p-3 bg-light">
                  {instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="instruction-row mb-3 last-no-border"
                    >
                      <div className="step-number">{idx + 1}</div>
                      <input
                        type="text"
                        className="form-control flex-grow-1"
                        placeholder={`Describe step ${idx + 1}...`}
                        value={step}
                        onChange={(e) => updateInstruction(idx, e.target.value)}
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => removeInstruction(idx)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Uploads */}
              <div className="row g-4 mt-4">
                {/* Cover Image */}
                <div className="col-md-6">
                  <label className="form-label fw-bold d-block mb-2">
                    Cover Image <span className="text-danger">*</span>
                  </label>

                  {coverPreview ? (
                    <div className="cover-preview-wrapper">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="cover-preview-img"
                      />
                      <button
                        type="button"
                        className="remove-media-btn"
                        onClick={removeCover}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-placeholder-card"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <img
                        src={productPlaceholder}
                        alt="placeholder"
                        className="upload-placeholder-icon"
                      />
                      <span>Click to upload cover image</span>
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                  />
                </div>

                {/* Demo Video */}
                <div className="col-md-6">
                  <label className="form-label fw-bold d-block mb-2">
                    Demo Video (optional)
                  </label>

                  {videoPreviewName ? (
                    <div className="video-preview-card">
                      <i className="fas fa-video fa-3x text-primary mb-3"></i>
                      <p className="video-name text-truncate">
                        {videoPreviewName}
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeVideo}
                      >
                        Remove / Replace
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-placeholder-card"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <i className="fas fa-film fa-3x text-muted mb-3"></i>
                      <span>Click to upload demo video</span>
                      <small className="text-muted d-block mt-1">
                        MP4, MOV • Optional
                      </small>
                    </div>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleVideoChange}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center mt-5 pt-4 border-top">
                <Button
                  title="Upload Yoga Guide"
                  width={280}
                  loading={loading}
                  onPress={handleUploadYogaGuide}
                  icon={<i className="fas fa-cloud-upload-alt"></i>}
                  disabled={loading}
                  className="btn-lg"
                />
              </div>
            </form>
          </div>
        </section>
      </div>
    </section>
  );
};

export default CreateYoga;
