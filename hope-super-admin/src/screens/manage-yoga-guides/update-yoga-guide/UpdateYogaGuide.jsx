/**
 * @file UpdateYogaGuide.jsx
 * @module Screens/Yoga/UpdateYogaGuide
 * @description Super Admin interface to **edit/update** an existing Yoga Guide
 */

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getYogaGuideById,
  updateYogaGuide,
} from "../../../redux/slices/yoga.slice";
import InputField from "../../../utilities/input-field/InputField.utility";
import Button from "../../../utilities/button/Button.utility";
import productPlaceholder from "../../../assets/placeHolder/product-placeholder.jpg";
import "./UpdateYogaGuide.css";

const UpdateYogaGuide = () => {
  const { guideId } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("Guide ID from URL:", guideId);

  const { selectedGuide, loading: sliceLoading } = useSelector(
    (state) => state.yoga,
  );

  const coverRef = useRef(null);
  const videoRef = useRef(null);

  // ── Form State ───────────────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "HATHA",
    difficultyLevel: "BEGINNER",
    durationMinutes: "",
    benefits: "",
    targetAreas: "",
    equipmentNeeded: "",
  });

  const [instructions, setInstructions] = useState([{ text: "" }]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ── Fetch guide data if not available from state ────────────
  useEffect(() => {
    if (guideId) {
      // If we have state from navigation, use it immediately
      if (state?.guide) {
        console.log("Using guide from navigation state:", state.guide);
        populateFormData(state.guide);
        setIsDataLoaded(true);
      }
      // Otherwise fetch from API
      else {
        console.log("Fetching guide from API");
        dispatch(getYogaGuideById(guideId));
      }
    }
  }, [guideId, dispatch, state?.guide]);

  // ── Populate form when data arrives from Redux ──────────────
  useEffect(() => {
    if (selectedGuide && selectedGuide._id === guideId && !isDataLoaded) {
      console.log("Populating form with Redux data:", selectedGuide);
      populateFormData(selectedGuide);
      setIsDataLoaded(true);
    }
  }, [selectedGuide, guideId, isDataLoaded]);

  // ── Helper function to populate form ─────────────────────────
  const populateFormData = (guide) => {
    setForm({
      title: guide.title || "",
      description: guide.description || "",
      category: guide.category || "HATHA",
      difficultyLevel: guide.difficultyLevel || "BEGINNER",
      durationMinutes: guide.durationMinutes?.toString() || "",
      benefits: guide.benefits?.join(", ") || "",
      targetAreas: guide.targetAreas?.join(", ") || "",
      equipmentNeeded: guide.equipmentNeeded?.join(", ") || "",
    });

    // Instructions
    if (Array.isArray(guide.instructions) && guide.instructions.length > 0) {
      setInstructions(
        guide.instructions.map((step) => ({
          text: step.text || "",
        })),
      );
    }

    // Existing media previews
    if (guide.coverImage) {
      setCoverPreview(guide.coverImage);
    }
    if (guide.video) {
      setVideoName("Current video uploaded");
    }
  };

  // ── Form Handlers ────────────────────────────────────────────
  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addInstruction = () => {
    setInstructions([...instructions, { text: "" }]);
  };

  const removeInstruction = (idx) => {
    if (instructions.length === 1) return;
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const updateInstruction = (idx, value) => {
    const updated = [...instructions];
    updated[idx].text = value;
    setInstructions(updated);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, coverImage: "" }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    setVideoFile(file);
    setVideoName(file.name);
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(form.coverImage || null);
    if (coverRef.current) coverRef.current.value = "";
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoName(selectedGuide?.video ? "Current video" : "");
    if (videoRef.current) videoRef.current.value = "";
  };

  // ── Validation & Submit ──────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (
      !form.durationMinutes ||
      isNaN(form.durationMinutes) ||
      Number(form.durationMinutes) < 1
    ) {
      newErrors.durationMinutes = "Enter a valid duration (minutes)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("difficultyLevel", form.difficultyLevel);
      formData.append("durationMinutes", form.durationMinutes.trim());

      // Parse arrays from comma-separated strings
      const parseArray = (str) =>
        str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      formData.append("benefits", JSON.stringify(parseArray(form.benefits)));
      formData.append(
        "targetAreas",
        JSON.stringify(parseArray(form.targetAreas)),
      );
      formData.append(
        "equipmentNeeded",
        JSON.stringify(parseArray(form.equipmentNeeded)),
      );

      // Instructions
      const cleanedInstructions = instructions
        .map((inst, idx) => ({
          stepNumber: idx + 1,
          text: inst.text.trim(),
        }))
        .filter((inst) => inst.text !== "");

      if (cleanedInstructions.length === 0) {
        toast.error("At least one instruction step is required");
        setLoading(false);
        return;
      }

      formData.append("instructions", JSON.stringify(cleanedInstructions));

      // Files (only append if new file is selected)
      if (coverFile) {
        formData.append("coverImage", coverFile);
      }
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const result = await dispatch(
        updateYogaGuide({ yogaId: guideId, formData }),
      );

      if (updateYogaGuide.fulfilled.match(result)) {
        toast.success("Yoga guide updated successfully!");
        navigate("/super-admin/yoga-guides/manage-guides");
      } else {
        toast.error(result.payload?.message || "Failed to update guide");
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
    <section id="update-yoga" className="py-5">
      <div className="container">
        <div className="upload-header text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">Update Yoga Guide</h1>
          <p className="text-muted lead">
            Modify "{form.title || "this guide"}" details
          </p>
        </div>

        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit} noValidate>
              {/* Title + Duration */}
              <div className="row g-4 mb-4">
                <div className="col-md-8">
                  <InputField
                    label="Pose / Sequence Name"
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    icon={<i className="fas fa-spa"></i>}
                    error={errors.title}
                    placeholder="e.g. Downward Facing Dog (Adho Mukha Svanasana)"
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Duration (minutes)"
                    type="number"
                    min="1"
                    value={form.durationMinutes}
                    onChange={(e) =>
                      updateForm("durationMinutes", e.target.value)
                    }
                    icon={<i className="fas fa-clock"></i>}
                    error={errors.durationMinutes}
                  />
                </div>
              </div>

              {/* Category + Difficulty */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                  >
                    <option value="HATHA">Hatha</option>
                    <option value="VINYASA">Vinyasa</option>
                    <option value="ASHTANGA">Ashtanga</option>
                    <option value="IYENGAR">Iyengar</option>
                    <option value="KUNDALINI">Kundalini</option>
                    <option value="RESTORATIVE">Restorative</option>
                    <option value="YIN">Yin</option>
                    <option value="POWER">Power</option>
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
                    value={form.difficultyLevel}
                    onChange={(e) =>
                      updateForm("difficultyLevel", e.target.value)
                    }
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <InputField
                  label="Description"
                  multiline
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  icon={<i className="fas fa-align-left"></i>}
                  error={errors.description}
                  placeholder="Brief overview of the practice and its purpose..."
                />
              </div>

              {/* Comma-separated arrays */}
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <InputField
                    label="Benefits (comma separated)"
                    value={form.benefits}
                    onChange={(e) => updateForm("benefits", e.target.value)}
                    icon={<i className="fas fa-heart text-danger"></i>}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Target Areas"
                    value={form.targetAreas}
                    onChange={(e) => updateForm("targetAreas", e.target.value)}
                    icon={<i className="fas fa-bullseye text-primary"></i>}
                  />
                </div>
                <div className="col-md-4">
                  <InputField
                    label="Equipment Needed"
                    value={form.equipmentNeeded}
                    onChange={(e) =>
                      updateForm("equipmentNeeded", e.target.value)
                    }
                    icon={<i className="fas fa-toolbox text-warning"></i>}
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold text-dark">
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
                  {instructions.map((inst, idx) => (
                    <div
                      key={idx}
                      className="instruction-row mb-3 last-no-border"
                    >
                      <div className="step-number">{idx + 1}</div>
                      <input
                        type="text"
                        className="form-control flex-grow-1"
                        placeholder={`Describe step ${idx + 1}...`}
                        value={inst.text}
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

              {/* Media */}
              <div className="row g-4 mb-5">
                {/* Cover Image */}
                <div className="col-md-6">
                  <label className="form-label fw-bold d-block mb-2">
                    Cover Image
                  </label>

                  {coverPreview ? (
                    <div className="position-relative rounded-3 overflow-hidden shadow-sm">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-100 object-fit-cover"
                        style={{ height: "220px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={removeCover}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-zone border border-dashed rounded-3 text-center p-5 bg-white"
                      onClick={() => coverRef.current?.click()}
                    >
                      <img
                        src={productPlaceholder}
                        alt=""
                        width="80"
                        className="mb-3 opacity-75"
                      />
                      <p className="mb-1 fw-medium">
                        Click to upload new cover image
                      </p>
                    </div>
                  )}
                  <input
                    ref={coverRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleCoverChange}
                  />
                  {errors.coverImage && (
                    <div className="invalid-feedback d-block">
                      {errors.coverImage}
                    </div>
                  )}
                </div>

                {/* Video */}
                <div className="col-md-6">
                  <label className="form-label fw-bold d-block mb-2">
                    Demo Video (optional)
                  </label>

                  {videoName || selectedGuide?.video ? (
                    <div className="position-relative bg-light rounded-3 p-4 text-center shadow-sm">
                      <i className="fas fa-video fa-3x text-primary mb-3"></i>
                      <p className="mb-1 fw-medium text-truncate">
                        {videoName || "Current video uploaded"}
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={removeVideo}
                      >
                        Remove / Replace Video
                      </button>
                    </div>
                  ) : (
                    <div
                      className="upload-zone border border-dashed rounded-3 text-center p-5 bg-white"
                      onClick={() => videoRef.current?.click()}
                    >
                      <i className="fas fa-film fa-3x text-muted mb-3"></i>
                      <p className="mb-1 fw-medium">
                        Click to upload new video
                      </p>
                      <small className="text-muted">MP4, MOV • Optional</small>
                    </div>
                  )}
                  <input
                    ref={videoRef}
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
                  title="Update Yoga Guide"
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

export default UpdateYogaGuide;
