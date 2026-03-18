/**
 * @file articles.slice.jsx
 * @module Redux/Slices/Articles
 * @description
 * Redux Toolkit slice managing administrative article operations.
 */

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONFIG from "../config/Config.config";

const { BACKEND_API_URL } = CONFIG;

const getToken = () => localStorage.getItem("authToken");

/**
 * @function createArticle
 * @async
 * @description Dispatches a POST request to create a new article.
 * @param {FormData} formData - Article details including image files.
 * @returns {Object} The newly created article object.
 */

export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await axios.post(
        `${BACKEND_API_URL}/library/create-article`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { newArticle, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        article: newArticle || response.data,
        message: message,
        success: true,
      };
    } catch (error) {
      const backendError = error.response?.data;

      if (backendError) {
        return rejectWithValue({
          message: backendError.message,
          success: backendError.success || false,
          status: error.response?.status,
        });
      }

      return rejectWithValue({
        message: error.message,
        success: false,
        status: 0,
      });
    }
  },
);

/**
 * Get All Articles (Admin functionality)
 * @returns {Promise<Object>} Aggregated articles array and server response metadata.
 */
export const getAllArticles = createAsyncThunk(
  "articles/getAllArticles",
  async (_, { rejectWithValue }) => {
    const token = getToken();

    if (!token) {
      return rejectWithValue({
        message: "Admin is not authenticated",
        success: false,
        status: 401,
      });
    }

    try {
      // Updated endpoint to reflect articles directory
      const response = await axios.get(
        `${BACKEND_API_URL}/library/get-all-articles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Destructuring 'allArticles' to match backend response key
      const { allArticles, message, success } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch articles");
      }

      return { allArticles: allArticles || [], message, success };
    } catch (error) {
      console.error(
        "Get All Articles Error:",
        error.response?.data || error.message,
      );

      const backendError = error.response?.data;

      return rejectWithValue({
        message:
          backendError?.message || error.message || "Network error occurred",
        success: false,
        status: error.response?.status || 0,
      });
    }
  },
);

/**
 * @function getArticleById
 * @async
 * @description Fetches a specific article by its ID.
 * @param {string} articleId - The unique MongoDB ID of the article.
 * @returns {Object} The article object.
 */
export const getArticleById = createAsyncThunk(
  "articles/getArticleById",
  async (articleId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Admin is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/library/get-article-by-id/${articleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const { article, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        success: true,
        message: message,
        article: article || response.data,
      };
    } catch (error) {
      const backendError = error.response?.data;

      if (backendError) {
        return rejectWithValue({
          message: backendError.message,
          success: backendError.success || false,
          status: error.response?.status,
        });
      }

      return rejectWithValue({
        message: error.message,
        success: false,
        status: 0,
      });
    }
  },
);

/**
 * @function updateArticle
 * @async
 * @description Sends a PATCH request to update an existing article's details.
 * @param {Object} params - The payload containing `articleId` and `formData`.
 */
export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ articleId, formData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await axios.patch(
        `${BACKEND_API_URL}/library/update-article/${articleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { updatedArticle, article, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        success: true,
        message: message,
        article: updatedArticle || article || response.data,
      };
    } catch (error) {
      const backendError = error.response?.data;

      if (backendError) {
        return rejectWithValue({
          message: backendError.message,
          success: backendError.success || false,
          status: error.response?.status,
        });
      }

      return rejectWithValue({
        message: error.message,
        success: false,
        status: 0,
      });
    }
  },
);

/**
 * @function deleteArticle
 * @async
 * @description Deletes a specific article by its unique ID. This action is protected and requires admin authentication.
 * @param {string} articleId - The unique MongoDB ID of the article (matches backend param).
 */
export const deleteArticle = createAsyncThunk(
  "articles/deleteArticle",
  async (articleId, { getState, rejectWithValue }) => {
    const token = getToken();
    if (!token)
      return rejectWithValue({
        message: "Admin is not authenticated.",
        success: false,
      });

    try {
      // Endpoint updated to use articleId as per backend requirements
      const response = await axios.delete(
        `${BACKEND_API_URL}/library/delete-article/${articleId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { message, success } = response.data;

      if (!success) throw new Error(message);

      // Note: Ensure 'state.articles.allArticles' matches your actual store structure
      const { allArticles } = getState().articles;
      const filteredArticles = allArticles.filter((a) => a._id !== articleId);

      return {
        success: true,
        message: message,
        articles: filteredArticles,
        deletedArticleId: articleId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message, success: false },
      );
    }
  },
);

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    allArticles: [],
    loading: false,
    error: null,
    message: null,
    success: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearAllArticles: (state) => {
      state.allArticles = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.allArticles.push(action.payload.article);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })

      .addCase(getAllArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.allArticles = action.payload.allArticles;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getAllArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
        state.success = action.payload?.success || false;
      })

      .addCase(getArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload.article;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.selectedArticle = null;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })
      .addCase(getArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })

      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        const updatedArticle = action.payload.article;
        state.allArticles = state.allArticles.map((article) =>
          article._id === updatedArticle._id ? updatedArticle : article,
        );
        if (state.selectedArticle?._id === updatedArticle._id) {
          state.selectedArticle = updatedArticle;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })

      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.allArticles = action.payload.articles;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      });
  },
});

export const { clearError, clearAllArticles } = articlesSlice.actions;
export default articlesSlice.reducer;
