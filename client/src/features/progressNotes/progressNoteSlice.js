import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as progressNoteApi from "../../api/progressNoteApi";

// Async thunks
export const createProgressNote = createAsyncThunk(
  "progressNotes/create",
  async (noteData, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.createProgressNote(noteData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create progress note"
      );
    }
  }
);

export const fetchProgressNotesByPatient = createAsyncThunk(
  "progressNotes/fetchByPatient",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.getProgressNotesByPatient(
        patientId,
        params
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch progress notes"
      );
    }
  }
);

export const fetchProgressNoteById = createAsyncThunk(
  "progressNotes/fetchById",
  async (noteId, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.getProgressNoteById(noteId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch progress note"
      );
    }
  }
);

export const updateProgressNote = createAsyncThunk(
  "progressNotes/update",
  async ({ noteId, updateData }, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.updateProgressNote(noteId, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update progress note"
      );
    }
  }
);

export const reviewProgressNote = createAsyncThunk(
  "progressNotes/review",
  async ({ noteId, reviewData }, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.reviewProgressNote(noteId, reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to review progress note"
      );
    }
  }
);

export const deleteProgressNote = createAsyncThunk(
  "progressNotes/delete",
  async (noteId, { rejectWithValue }) => {
    try {
      await progressNoteApi.deleteProgressNote(noteId);
      return noteId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete progress note"
      );
    }
  }
);

export const fetchProgressNoteTemplates = createAsyncThunk(
  "progressNotes/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.getProgressNoteTemplates();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

export const createProgressNoteTemplate = createAsyncThunk(
  "progressNotes/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const data = await progressNoteApi.createProgressNoteTemplate(
        templateData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create template"
      );
    }
  }
);

const initialState = {
  notes: [],
  currentNote: null,
  templates: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {
    noteType: "",
    status: "",
  },
  loading: false,
  error: null,
};

const progressNoteSlice = createSlice({
  name: "progressNotes",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create progress note
      .addCase(createProgressNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgressNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload.progressNote);
      })
      .addCase(createProgressNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch progress notes by patient
      .addCase(fetchProgressNotesByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressNotesByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.progressNotes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProgressNotesByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch progress note by ID
      .addCase(fetchProgressNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNote = action.payload.progressNote;
      })
      .addCase(fetchProgressNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update progress note
      .addCase(updateProgressNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProgressNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(
          (note) => note.id === action.payload.progressNote.id
        );
        if (index !== -1) {
          state.notes[index] = action.payload.progressNote;
        }
        if (state.currentNote?.id === action.payload.progressNote.id) {
          state.currentNote = action.payload.progressNote;
        }
      })
      .addCase(updateProgressNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Review progress note
      .addCase(reviewProgressNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewProgressNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(
          (note) => note.id === action.payload.progressNote.id
        );
        if (index !== -1) {
          state.notes[index] = action.payload.progressNote;
        }
        if (state.currentNote?.id === action.payload.progressNote.id) {
          state.currentNote = action.payload.progressNote;
        }
      })
      .addCase(reviewProgressNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete progress note
      .addCase(deleteProgressNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProgressNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter((note) => note.id !== action.payload);
        if (state.currentNote?.id === action.payload) {
          state.currentNote = null;
        }
      })
      .addCase(deleteProgressNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch templates
      .addCase(fetchProgressNoteTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressNoteTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
      })
      .addCase(fetchProgressNoteTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create template
      .addCase(createProgressNoteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProgressNoteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload.template);
      })
      .addCase(createProgressNoteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentNote, clearError } =
  progressNoteSlice.actions;

export default progressNoteSlice.reducer;
