/**
 * @file Yoga.slice.js
 * @module Redux/Slices/Yoga
 * @description
 * Redux Toolkit slice managing administrative yoga-guide operations.
 */

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CONFIG from "../config/Config.config";

const { BACKEND_API_URL } = CONFIG;

const getToken = () => localStorage.getItem("authToken");

/**
 * @function createYogaGuide
 * @async
 * @description Dispatches a POST request to create a new yoga guide.
 * @param {FormData} formData - Yoga guide details including image files.
 * @returns {Object} The newly created yoga guide object.
 */

export const createYogaGuide = createAsyncThunk(
  "yoga/createYogaGuide",
  async (formData, { rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await axios.post(
        `${BACKEND_API_URL}/yoga/create-yoga-guide`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { newYogaGuide, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        yogaGuide: newYogaGuide || response.data,
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
 * Get All Yoga Guides (Admin functionality)
 * @returns {Promise<Object>} Aggregated guides array and server response metadata.
 */
export const getAllYogaGuides = createAsyncThunk(
  "yoga/getAllYogaGuides",
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
      // Updated endpoint to reflect yoga guide directory
      const response = await axios.get(
        `${BACKEND_API_URL}/yoga/get-all-yoga-guides`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Destructuring 'allGuides' to match backend response key
      const { allYogaGuides, message, success } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch yoga guides");
      }

      return { allGuides: allYogaGuides || [], message, success };
    } catch (error) {
      console.error(
        "Get All Yoga Guides Error:",
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
 * @function getYogaGuideById
 * @async
 * @description Fetches a specific yoga guide by its ID.
 * @param {string} yogaId - The unique MongoDB ID of the yoga guide.
 * @returns {Object} The yoga guide object.
 */
export const getYogaGuideById = createAsyncThunk(
  "yoga/getYogaGuideById",
  async (yogaId, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return rejectWithValue("Admin is not authenticated.");

    try {
      const response = await axios.get(
        `${BACKEND_API_URL}/yoga/get-yoga-guide-by-id/${yogaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const { yogaGuide, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        success: true,
        message: message,
        yogaGuide: yogaGuide || response.data,
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
 * @function updateYogaGuide
 * @async
 * @description Sends a PATCH request to update an existing yoga guide's details.
 * @param {Object} params - The payload containing `yogaId` and `formData`.
 */
export const updateYogaGuide = createAsyncThunk(
  "yoga/updateYogaGuide",
  async ({ yogaId, formData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      const response = await axios.patch(
        `${BACKEND_API_URL}/yoga/update-yoga-guide/${yogaId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { updatedYogaGuide, yogaGuide, message, success } = response.data;

      if (!success) {
        throw new Error(message);
      }

      return {
        success: true,
        message: message,
        yogaGuide: updatedYogaGuide || yogaGuide || response.data,
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
 * @function deleteYogaGuide
 * @async
 * @description Removes a yoga guide record and filters the local state to reflect changes.
 * @param {string} yogaId - The unique MongoDB ID of the yoga guide (matches backend param).
 */
export const deleteYogaGuide = createAsyncThunk(
  "yoga/deleteYogaGuide",
  async (yogaId, { getState, rejectWithValue }) => {
    const token = getToken();
    if (!token)
      return rejectWithValue({
        message: "Admin is not authenticated.",
        success: false,
      });

    try {
      // Endpoint updated to use yogaId as per backend requirements
      const response = await axios.delete(
        `${BACKEND_API_URL}/yoga/delete-yoga-guide/${yogaId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const { message, success } = response.data;

      if (!success) throw new Error(message);

      // Note: Ensure 'state.yoga.allGuides' matches your actual store structure
      const { allGuides } = getState().yoga;
      const filteredYogaGuides = allGuides.filter((g) => g._id !== yogaId);

      return {
        success: true,
        message: message,
        yogaGuides: filteredYogaGuides,
        deletedGuideId: yogaId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message, success: false },
      );
    }
  },
);

const yogaSlice = createSlice({
  name: "yoga",
  initialState: {
    allGuides: [], // Renamed from allUsers
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
    clearAllGuides: (state) => {
      // Renamed from clearAllUsers
      state.allGuides = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createYogaGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(createYogaGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.allGuides.push(action.payload.yogaGuide);
      })
      .addCase(createYogaGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })

      .addCase(getAllYogaGuides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllYogaGuides.fulfilled, (state, action) => {
        state.loading = false;
        state.allGuides = action.payload.allGuides;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getAllYogaGuides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
        state.success = action.payload?.success || false;
      })

      .addCase(getYogaGuideById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedYogaGuide = action.payload.yogaGuide;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(getYogaGuideById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.selectedYogaGuide = null;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })
      .addCase(getYogaGuideById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })

      .addCase(updateYogaGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(updateYogaGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        const updatedYogaGuide = action.payload.yogaGuide;
        state.allGuides = state.allGuides.map((guide) =>
          guide._id === updatedYogaGuide._id ? updatedYogaGuide : guide,
        );
        if (state.selectedYogaGuide?._id === updatedYogaGuide._id) {
          state.selectedYogaGuide = updatedYogaGuide;
        }
      })
      .addCase(updateYogaGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      })

      .addCase(deleteYogaGuide.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.success = null;
      })
      .addCase(deleteYogaGuide.fulfilled, (state, action) => {
        state.loading = false;
        state.allGuides = action.payload.yogaGuides;
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(deleteYogaGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.payload;
        state.message = action.payload.message;
        state.success = action.payload.success || false;
      });
  },
});

export const { clearError, clearAllGuides } = yogaSlice.actions;
export default yogaSlice.reducer;
