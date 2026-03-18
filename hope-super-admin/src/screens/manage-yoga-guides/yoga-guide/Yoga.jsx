/**
 * @file Yoga.jsx
 * @module Screens/YogaGuides/Management
 * @description
 * The primary interface for Super Admins to view, filter, and moderate the yoga guide catalog.
 * * **Key Capabilities:**
 * - **Live Search:** Client-side filtering of the `yogaGuides` state based on title matches.
 * - **Dynamic Actions:** Contextual popover menus per table row (View, Edit, Delete).
 * - **Guide Metrics:** Aggregated stats for total and active yoga guide counts.
 * - **Destructive Workflows:** Implements a two-step verification (Modal confirmation) for guide deletion.
 * * @requires react-redux
 * @requires react-router-dom
 * @requires react-hot-toast
 */

import React, { useState, useEffect } from "react";
import "./Yoga.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteYogaGuide,
  getAllYogaGuides,
} from "../../../redux/slices/yoga.slice";
import Loader from "../../../utilities/loader/Loader.utility";
import InputField from "../../../utilities/input-field/InputField.utility";
import PopOver from "../../../utilities/pop-over/PopOver.utility";
import Modal from "../../../utilities/modal/Modal.utlity";
import { toast } from "react-hot-toast";
import Button from "../../../utilities/button/Button.utility";
import { useRef } from "react";

const Yoga = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionButtonRefs = useRef({});
  const user = useSelector((state) => state.auth.user);
  const allYogaGuides = useSelector((state) => state.yoga.allGuides || []);
  const [search, setSearch] = useState("");
  const [activePopover, setActivePopover] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllYogaGuides());
    }
  }, [dispatch, user?.id]);

  const stats = {
    total: allYogaGuides.length,
    active: allYogaGuides.filter((g) => g.isActive === true).length,
  };

  const filteredGuides = allYogaGuides.filter((guide) =>
    guide.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const getActionItems = (guide) => [
    {
      label: "View Details",
      icon: "fas fa-eye",
      action: () =>
        navigate(
          `/super-admin/yoga-guides/manage-guides/yoga-guide-details/${guide._id}`,
          {
            state: { guide },
          },
        ),
    },
    {
      label: "Edit Guide",
      icon: "fas fa-pencil-alt",
      action: () => {
        console.log("Navigating to update with ID:", guide._id);
        console.log("Full guide object being passed in state:", guide);
        navigate(
          `/super-admin/yoga-guides/manage-guides/update-yoga-guide/${guide._id}`,
          {
            state: { guide },
          },
        );
      },
    },
    {
      label: "Delete",
      icon: "fas fa-trash",
      type: "danger",
      action: () => handleOpenDeleteModal(guide),
    },
  ];

  const handleOpenDeleteModal = (guide) => {
    setSelectedGuide(guide);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedGuide) return;
    setDeleting(true);

    try {
      // Pass the _id directly as the yogaId parameter expected by the Thunk
      const result = await dispatch(deleteYogaGuide(selectedGuide._id));

      if (deleteYogaGuide.fulfilled.match(result)) {
        // The Thunk returns { message, success, yogaGuides ... }
        const { message } = result.payload;

        toast.success(message || "Yoga guide deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedGuide(null);
      } else {
        // Extract error message from rejected payload
        const errorMsg = result.payload?.message || "Failed to delete guide";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section id="yoga-guides">
      <div className="yoga-guides-container">
        <div className="yoga-guides-breadcrumb">
          <div className="yoga-guides-header">
            <h1 className="yoga-guides-title">Yoga Guides</h1>
            <p className="yoga-guides-subtitle">
              Manage all your yoga guides and content
            </p>
          </div>

          <div className="search-wrapper">
            <InputField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              width={450}
              icon={<i className="fas fa-search"></i>}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-total">
            <h3>Total Guides</h3>
            <p className="stat-value">{stats.total.toLocaleString()}</p>
          </div>
          <div className="stat-card stat-active">
            <h3>Active</h3>
            <p className="stat-value">{stats.active}</p>
          </div>

          <div className="btn-container">
            <Button
              title="Add Guide"
              width={150}
              icon={<i className="fas fa-plus-circle"></i>}
              onPress={() =>
                navigate(
                  "/super-admin/yoga-guides/manage-guides/add-yoga-guide",
                )
              }
            />
          </div>
        </div>

        <div className="table-card">
          <div className="table-responsive">
            {loading ? (
              <div className="loader-container">
                <Loader />
              </div>
            ) : (
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th>Guide Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuides.map((guide) => (
                    <tr key={guide._id}>
                      <td className="guide-name">{guide.title}</td>
                      <td>{guide.category || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            guide.isActive ? "active" : "inactive"
                          }`}
                        >
                          {guide.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{guide.durationMinutes || "N/A"} min</td>
                      <td className="action-dots">
                        <div className="popover-anchor">
                          <button
                            ref={(el) =>
                              (actionButtonRefs.current[guide._id] = el)
                            }
                            className="action-dots"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePopover(
                                activePopover === guide._id ? null : guide._id,
                              );
                            }}
                          >
                            <i
                              className="fas fa-ellipsis-v"
                              style={{ marginLeft: 40 }}
                            ></i>
                          </button>

                          <PopOver
                            isOpen={activePopover === guide._id}
                            onClose={() => setActivePopover(null)}
                            items={getActionItems(guide)}
                            className="yoga-guide-actions-popover"
                            anchorRef={{
                              current: actionButtonRefs.current[guide._id],
                            }}
                            position="bottom"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredGuides.length === 0 && (
              <div className="no-guides-state">
                <i className="fas fa-spa no-guides-icon"></i>
                <h3>No Yoga Guides Found</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Yoga Guide?"
        buttons={[
          {
            label: "Cancel",
            className: "cancel-btn",
            onClick: () => setIsDeleteModalOpen(false),
          },
          {
            label: "Delete",
            className: "danger-btn",
            onClick: handleDelete,
            loading: deleting,
          },
        ]}
      >
        Are you sure you want to delete <strong>{selectedGuide?.title}</strong>?
      </Modal>
    </section>
  );
};

export default Yoga;
