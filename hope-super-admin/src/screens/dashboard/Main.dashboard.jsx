/**
 * @file Main.dashboard.jsx
 * @module Screens/Dashboard/Main
 * @description
 * The primary entry point for the Admin Dashboard.
 * * **Data Aggregation:**
 * - Connects to the `auth` slice to verify identity.
 * - Connects to the `products` slice to compute inventory metrics.
 * * **Workflow:**
 * - **Auto-Sync:** Triggers a global product fetch on mount if an authenticated user is detected.
 * - **Metric Calculation:** Derives `totalProducts` from the store for real-time display.
 * - **Navigation:** Provides quick-action routing to detailed management modules.
 * * @requires react-redux
 * @requires react-router-dom
 */

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../utilities/card/Card.utility";
import { getAllUsers } from "../../redux/slices/user.slice";
import { getAllYogaGuides } from "../../redux/slices/yoga.slice";
import { getAllArticles } from "../../redux/slices/articles.slice";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.users.allUsers || []);
  const allYogaGuides = useSelector((state) => state.yoga.allGuides || []);
  const allArticles = useSelector((state) => state.articles.allArticles || []);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllUsers());
      dispatch(getAllYogaGuides());
      dispatch(getAllArticles());
    }
  }, [dispatch, user?.id]);

  const userStats = useMemo(() => {
    return {
      totalUsers: allUsers.length,
    };
  }, [allUsers]);

  const yogaStats = useMemo(() => {
    return {
      totalGuide: allYogaGuides.length,
    };
  }, [allYogaGuides]);

  const articleStats = useMemo(() => {
    return {
      totalArticles: allArticles.length,
    };
  }, [allArticles]);

  const handleNavigateUsers = () => navigate("/super-admin/users/manage-users");
  const handleNavigateYogaGuides = () => navigate("/super-admin/yoga-guides/manage-guides");
  const handleNavigateArticles = () => navigate("/super-admin/articles/manage-articles");

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-6 col-lg-6">
            <h1
              className="header"
              style={{ marginTop: 25, fontWeight: "bold" }}
            >
              Admin Dashboard
            </h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-6 col-md-4 col-lg-4">
            <Card
              title="Total Users"
              icon={<i className="fas fa-users" />}
              mainValue={userStats.totalUsers}
              accentColor="#7209b7"
              hoverEffect={true}
              size="small"
              onClick={handleNavigateUsers}
            />
          </div>

          <div className="col-6 col-md-4 col-lg-4">
            <Card
              title="Total Yoga Guides"
              icon={<i className="fas fa-spa no-guides-icon" />}
              mainValue={yogaStats.totalGuide}
              accentColor="#3a86ff"
              hoverEffect={true}
              size="small"
              onClick={handleNavigateYogaGuides}
            />
          </div>

          <div className="col-6 col-md-4 col-lg-4">
            <Card
              title="Total Articles"
              icon={<i className="fas fa-newspaper" />}
              mainValue={articleStats.totalArticles}
              accentColor="#ff006e"
              hoverEffect={true}
              size="small"
              onClick={handleNavigateArticles}

            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
