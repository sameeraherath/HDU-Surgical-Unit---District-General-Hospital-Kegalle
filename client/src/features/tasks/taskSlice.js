import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as taskApi from "../../api/taskApi";

// Async thunks
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const data = await taskApi.createTask(taskData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const fetchMyTasks = createAsyncThunk(
  "tasks/fetchMyTasks",
  async (params, { rejectWithValue }) => {
    try {
      const data = await taskApi.getMyTasks(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch my tasks"
      );
    }
  }
);

export const fetchTasksCreatedByMe = createAsyncThunk(
  "tasks/fetchCreatedByMe",
  async (params, { rejectWithValue }) => {
    try {
      const data = await taskApi.getTasksCreatedByMe(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch created tasks"
      );
    }
  }
);

export const fetchTasksByPatient = createAsyncThunk(
  "tasks/fetchByPatient",
  async ({ patientId, params }, { rejectWithValue }) => {
    try {
      const data = await taskApi.getTasksByPatient(patientId, params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient tasks"
      );
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  "tasks/fetchOverdue",
  async (params, { rejectWithValue }) => {
    try {
      const data = await taskApi.getOverdueTasks(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch overdue tasks"
      );
    }
  }
);

export const fetchTaskStatistics = createAsyncThunk(
  "tasks/fetchStatistics",
  async (params, { rejectWithValue }) => {
    try {
      const data = await taskApi.getTaskStatistics(params);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task statistics"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, statusData }, { rejectWithValue }) => {
    try {
      const data = await taskApi.updateTaskStatus(taskId, statusData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, updateData }, { rejectWithValue }) => {
    try {
      const data = await taskApi.updateTask(taskId, updateData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const cancelTask = createAsyncThunk(
  "tasks/cancel",
  async ({ taskId, cancellationData }, { rejectWithValue }) => {
    try {
      const data = await taskApi.cancelTask(taskId, cancellationData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const initialState = {
  myTasks: [],
  createdTasks: [],
  patientTasks: [],
  overdueTasks: [],
  statistics: {
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    urgentTasks: 0,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  filters: {
    status: "",
    priority: "",
    taskType: "",
  },
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTasks.unshift(action.payload.task);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch my tasks
      .addCase(fetchMyTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.myTasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch created by me
      .addCase(fetchTasksCreatedByMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksCreatedByMe.fulfilled, (state, action) => {
        state.loading = false;
        state.createdTasks = action.payload.tasks;
      })
      .addCase(fetchTasksCreatedByMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by patient
      .addCase(fetchTasksByPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patientTasks = action.payload.tasks;
      })
      .addCase(fetchTasksByPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch overdue
      .addCase(fetchOverdueTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.overdueTasks = action.payload.tasks;
      })
      .addCase(fetchOverdueTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch statistics
      .addCase(fetchTaskStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchTaskStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updateTaskInArray = (arr) => {
          const index = arr.findIndex((t) => t.id === action.payload.task.id);
          if (index !== -1) arr[index] = action.payload.task;
        };
        updateTaskInArray(state.myTasks);
        updateTaskInArray(state.createdTasks);
        updateTaskInArray(state.patientTasks);
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updateTaskInArray = (arr) => {
          const index = arr.findIndex((t) => t.id === action.payload.task.id);
          if (index !== -1) arr[index] = action.payload.task;
        };
        updateTaskInArray(state.myTasks);
        updateTaskInArray(state.createdTasks);
        updateTaskInArray(state.patientTasks);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel task
      .addCase(cancelTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelTask.fulfilled, (state, action) => {
        state.loading = false;
        const updateTaskInArray = (arr) => {
          const index = arr.findIndex((t) => t.id === action.payload.task.id);
          if (index !== -1) arr[index] = action.payload.task;
        };
        updateTaskInArray(state.myTasks);
        updateTaskInArray(state.createdTasks);
        updateTaskInArray(state.patientTasks);
      })
      .addCase(cancelTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const removeTaskFromArray = (arr) =>
          arr.filter((t) => t.id !== action.payload);
        state.myTasks = removeTaskFromArray(state.myTasks);
        state.createdTasks = removeTaskFromArray(state.createdTasks);
        state.patientTasks = removeTaskFromArray(state.patientTasks);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = taskSlice.actions;

export default taskSlice.reducer;
