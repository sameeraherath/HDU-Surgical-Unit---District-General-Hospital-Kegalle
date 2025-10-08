import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as teachingNoteApi from '../../api/teachingNoteApi';

// Async thunks
export const fetchAllTeachingNotes = createAsyncThunk(
  'teachingNotes/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.getAllTeachingNotes(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTeachingNotesByConsultant = createAsyncThunk(
  'teachingNotes/fetchByConsultant',
  async ({ consultantId, params }, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.getTeachingNotesByConsultant(consultantId, params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTeachingNotesByPatient = createAsyncThunk(
  'teachingNotes/fetchByPatient',
  async (patientId, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.getTeachingNotesByPatient(patientId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTeachingNoteById = createAsyncThunk(
  'teachingNotes/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.getTeachingNoteById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTeachingNote = createAsyncThunk(
  'teachingNotes/create',
  async (teachingNoteData, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.createTeachingNote(teachingNoteData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTeachingNote = createAsyncThunk(
  'teachingNotes/update',
  async ({ id, teachingNoteData }, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.updateTeachingNote(id, teachingNoteData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTeachingNote = createAsyncThunk(
  'teachingNotes/delete',
  async (id, { rejectWithValue }) => {
    try {
      await teachingNoteApi.deleteTeachingNote(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchTeachingNotes = createAsyncThunk(
  'teachingNotes/search',
  async (searchQuery, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.searchTeachingNotes(searchQuery);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTeachingStats = createAsyncThunk(
  'teachingNotes/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await teachingNoteApi.getTeachingStats();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  teachingNotes: [],
  currentTeachingNote: null,
  searchResults: [],
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    consultantId: null,
    sessionType: null,
    startDate: null,
    endDate: null,
    tags: null,
  },
};

// Slice
const teachingNoteSlice = createSlice({
  name: 'teachingNotes',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentTeachingNote: (state, action) => {
      state.currentTeachingNote = action.payload;
    },
    clearCurrentTeachingNote: (state) => {
      state.currentTeachingNote = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teaching notes
      .addCase(fetchAllTeachingNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTeachingNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.teachingNotes = action.payload.teachingNotes || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllTeachingNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch teaching notes by consultant
      .addCase(fetchTeachingNotesByConsultant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachingNotesByConsultant.fulfilled, (state, action) => {
        state.loading = false;
        state.teachingNotes = action.payload.teachingNotes || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchTeachingNotesByConsultant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch teaching notes by patient
      .addCase(fetchTeachingNotesByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachingNotesByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.teachingNotes = action.payload.teachingNotes || action.payload;
      })
      .addCase(fetchTeachingNotesByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch teaching note by ID
      .addCase(fetchTeachingNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachingNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeachingNote = action.payload.teachingNote || action.payload;
      })
      .addCase(fetchTeachingNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create teaching note
      .addCase(createTeachingNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeachingNote.fulfilled, (state, action) => {
        state.loading = false;
        state.teachingNotes.unshift(action.payload.teachingNote || action.payload);
      })
      .addCase(createTeachingNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update teaching note
      .addCase(updateTeachingNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeachingNote.fulfilled, (state, action) => {
        state.loading = false;
        const updatedNote = action.payload.teachingNote || action.payload;
        const index = state.teachingNotes.findIndex((tn) => tn.id === updatedNote.id);
        if (index !== -1) {
          state.teachingNotes[index] = updatedNote;
        }
        if (state.currentTeachingNote?.id === updatedNote.id) {
          state.currentTeachingNote = updatedNote;
        }
      })
      .addCase(updateTeachingNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete teaching note
      .addCase(deleteTeachingNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeachingNote.fulfilled, (state, action) => {
        state.loading = false;
        state.teachingNotes = state.teachingNotes.filter((tn) => tn.id !== action.payload);
        if (state.currentTeachingNote?.id === action.payload) {
          state.currentTeachingNote = null;
        }
      })
      .addCase(deleteTeachingNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search teaching notes
      .addCase(searchTeachingNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTeachingNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.teachingNotes || action.payload;
      })
      .addCase(searchTeachingNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchTeachingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || action.payload;
      })
      .addCase(fetchTeachingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentTeachingNote,
  clearCurrentTeachingNote,
  clearSearchResults,
  clearError,
} = teachingNoteSlice.actions;

export default teachingNoteSlice.reducer;
