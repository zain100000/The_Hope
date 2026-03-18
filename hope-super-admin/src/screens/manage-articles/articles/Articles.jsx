/**
 * @file Articles.jsx
 * @module Screens/Articles/Management
 * @description
 * The primary interface for Super Admins to view, filter, and moderate the article catalog.
 *
 * **Key Capabilities:**
 * - Live Search: Client-side filtering of the `articles` state based on title matches.
 * - Dynamic Actions: Contextual popover menus per table row (View, Edit, Delete).
 * - Article Metrics: Aggregated stats for total and published article counts.
 * - Destructive Workflows: Implements a two-step verification (Modal confirmation) for article deletion.
 *
 * @requires react-redux
 * @requires react-router-dom
 * @requires react-hot-toast
 */

import React, { useState, useEffect } from "react";
import "./Articles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteArticle,
  getAllArticles,
} from "../../../redux/slices/articles.slice";
import Loader from "../../../utilities/loader/Loader.utility";
import InputField from "../../../utilities/input-field/InputField.utility";
import PopOver from "../../../utilities/pop-over/PopOver.utility";
import Modal from "../../../utilities/modal/Modal.utlity";
import { toast } from "react-hot-toast";
import Button from "../../../utilities/button/Button.utility";
import { useRef } from "react";

const Articles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actionButtonRefs = useRef({});
  const user = useSelector((state) => state.auth.user);
  const allArticles = useSelector((state) => state.articles.allArticles || []);
  const [search, setSearch] = useState("");
  const [activePopover, setActivePopover] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllArticles());
    }
  }, [dispatch, user?.id]);

  console.log("All Articles from Redux Store:", allArticles);

  const stats = {
    total: allArticles.length,
    published: allArticles.filter((a) => a.isPublished === true).length,
  };

  const filteredArticles = allArticles.filter((article) =>
    article.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const getActionItems = (article) => [
    {
      label: "View Details",
      icon: "fas fa-eye",
      action: () =>
        navigate(
          `/super-admin/articles/manage-articles/article-details/${article._id}`,
          {
            state: { article },
          },
        ),
    },
    {
      label: "Edit Article",
      icon: "fas fa-pencil-alt",
      action: () => {
        console.log("Navigating to update with ID:", article._id);
        console.log("Full article object being passed in state:", article);
        navigate(
          `/super-admin/articles/manage-articles/update-article/${article._id}`,
          {
            state: { article },
          },
        );
      },
    },
    {
      label: "Delete",
      icon: "fas fa-trash",
      type: "danger",
      action: () => handleOpenDeleteModal(article),
    },
  ];

  const handleOpenDeleteModal = (article) => {
    setSelectedArticle(article);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    setDeleting(true);

    try {
      const result = await dispatch(deleteArticle(selectedArticle._id));

      if (deleteArticle.fulfilled.match(result)) {
        const { message } = result.payload;
        toast.success(message || "Article deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedArticle(null);
      } else {
        const errorMsg = result.payload?.message || "Failed to delete article";
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section id="articles">
      <div className="articles-container">
        <div className="articles-breadcrumb">
          <div className="articles-header">
            <h1 className="articles-title">Articles</h1>
            <p className="articles-subtitle">
              Manage all your articles and content
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
            <h3>Total Articles</h3>
            <p className="stat-value">{stats.total.toLocaleString()}</p>
          </div>
          <div className="stat-card stat-active">
            <h3>Published</h3>
            <p className="stat-value">{stats.published}</p>
          </div>

          <div className="btn-container">
            <Button
              title="Add Article"
              width={150}
              icon={<i className="fas fa-plus-circle"></i>}
              onPress={() =>
                navigate("/super-admin/articles/manage-articles/add-article")
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
                    <th>Article Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article._id}>
                      <td className="article-name">{article.title}</td>
                      <td>{article.category || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            article.isPublished ? "active" : "inactive"
                          }`}
                        >
                          {article.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td>
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="action-dots">
                        <div className="popover-anchor">
                          <button
                            ref={(el) =>
                              (actionButtonRefs.current[article._id] = el)
                            }
                            className="action-dots"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePopover(
                                activePopover === article._id ? null : article._id,
                              );
                            }}
                          >
                            <i
                              className="fas fa-ellipsis-v"
                            ></i>
                          </button>

                          <PopOver
                            isOpen={activePopover === article._id}
                            onClose={() => setActivePopover(null)}
                            items={getActionItems(article)}
                            className="article-actions-popover"
                            anchorRef={{
                              current: actionButtonRefs.current[article._id],
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
            {!loading && filteredArticles.length === 0 && (
              <div className="no-articles-state">
                <i className="fas fa-newspaper no-articles-icon"></i>
                <h3>No Articles Found</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Article?"
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
        Are you sure you want to delete <strong>{selectedArticle?.title}</strong>?
      </Modal>
    </section>
  );
};

export default Articles;