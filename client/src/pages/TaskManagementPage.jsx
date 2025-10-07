import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import {
  fetchMyTasks,
  fetchTasksCreatedByMe,
  fetchOverdueTasks,
  createTask,
  updateTaskStatus,
  cancelTask,
  deleteTask,
  setFilters,
  clearError,
} from "../features/tasks/taskSlice";

const TaskManagementPage = () => {
  const dispatch = useDispatch();
  const {
    myTasks,
    createdTasks,
    overdueTasks,
    pagination,
    filters,
    loading,
    error,
  } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    patientId: "",
    assignedTo: "",
    taskType: "PATIENT_REVIEW",
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    dueTime: "",
  });
  const [statusData, setStatusData] = useState({
    status: "",
    completionNotes: "",
  });

  const loadTasks = React.useCallback(() => {
    const params = { page: page + 1, limit: rowsPerPage, ...filters };
    if (currentTab === 0) {
      dispatch(fetchMyTasks(params));
    } else if (currentTab === 1) {
      dispatch(fetchTasksCreatedByMe(params));
    } else if (currentTab === 2) {
      dispatch(fetchOverdueTasks(params));
    }
  }, [dispatch, currentTab, page, rowsPerPage, filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPage(0);
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const handleOpenCreateDialog = () => {
    setFormData({
      patientId: "",
      assignedTo: "",
      taskType: "PATIENT_REVIEW",
      title: "",
      description: "",
      priority: "MEDIUM",
      dueDate: "",
      dueTime: "",
    });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCreateTask = async () => {
    try {
      await dispatch(createTask(formData)).unwrap();
      handleCloseCreateDialog();
      loadTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleOpenStatusDialog = (task) => {
    setSelectedTask(task);
    setStatusData({
      status: task.status === "PENDING" ? "IN_PROGRESS" : "COMPLETED",
      completionNotes: "",
    });
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedTask(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await dispatch(
        updateTaskStatus({
          taskId: selectedTask.id,
          statusData,
        })
      ).unwrap();
      handleCloseStatusDialog();
      loadTasks();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleCancelTask = async (taskId) => {
    if (window.confirm("Are you sure you want to cancel this task?")) {
      try {
        await dispatch(
          cancelTask({
            taskId,
            cancellationData: { cancellationReason: "Cancelled by user" },
          })
        ).unwrap();
        loadTasks();
      } catch (err) {
        console.error("Failed to cancel task:", err);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        loadTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return "error";
      case "URGENT":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "PENDING":
        return "info";
      case "CANCELLED":
        return "default";
      case "OVERDUE":
        return "error";
      default:
        return "default";
    }
  };

  const renderTaskTable = (tasks) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body2" color="textSecondary">
                  No tasks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {task.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {task.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={task.taskType} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.assignee?.username || "N/A"}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(new Date(task.dueDate), {
                      addSuffix: true,
                    })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    {(task.status === "PENDING" ||
                      task.status === "IN_PROGRESS") && (
                      <>
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenStatusDialog(task)}
                            color="primary"
                          >
                            {task.status === "PENDING" ? (
                              <PlayArrowIcon fontSize="small" />
                            ) : (
                              <CheckCircleIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Task">
                          <IconButton
                            size="small"
                            onClick={() => handleCancelTask(task.id)}
                            color="warning"
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {(user?.id === task.assignedBy ||
                      user?.role === "Consultant") && (
                      <Tooltip title="Delete Task">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteTask(task.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const getCurrentTasks = () => {
    switch (currentTab) {
      case 0:
        return myTasks;
      case 1:
        return createdTasks;
      case 2:
        return overdueTasks;
      default:
        return [];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Task Management</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Create Task
          </Button>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="My Tasks" />
          <Tab label="Created by Me" />
          <Tab label="Overdue Tasks" />
        </Tabs>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) =>
                    dispatch(setFilters({ status: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) =>
                    dispatch(setFilters({ priority: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={filters.taskType}
                  label="Task Type"
                  onChange={(e) =>
                    dispatch(setFilters({ taskType: e.target.value }))
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="PATIENT_REVIEW">Patient Review</MenuItem>
                  <MenuItem value="VITAL_SIGNS_CHECK">
                    Vital Signs Check
                  </MenuItem>
                  <MenuItem value="MEDICATION_ADMINISTRATION">
                    Medication Administration
                  </MenuItem>
                  <MenuItem value="INVESTIGATION_ORDER">
                    Investigation Order
                  </MenuItem>
                  <MenuItem value="DOCUMENTATION">Documentation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Task Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {renderTaskTable(getCurrentTasks())}
              <TablePagination
                component="div"
                count={pagination.total}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.taskType}
                  label="Task Type"
                  onChange={(e) =>
                    setFormData({ ...formData, taskType: e.target.value })
                  }
                >
                  <MenuItem value="PATIENT_REVIEW">Patient Review</MenuItem>
                  <MenuItem value="VITAL_SIGNS_CHECK">
                    Vital Signs Check
                  </MenuItem>
                  <MenuItem value="MEDICATION_ADMINISTRATION">
                    Medication Administration
                  </MenuItem>
                  <MenuItem value="INVESTIGATION_ORDER">
                    Investigation Order
                  </MenuItem>
                  <MenuItem value="DOCUMENTATION">Documentation</MenuItem>
                  <MenuItem value="CONSULTATION">Consultation</MenuItem>
                  <MenuItem value="PROCEDURE">Procedure</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Patient ID"
                type="number"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Assign To (User ID)"
                type="number"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Time"
                type="time"
                value={formData.dueTime}
                onChange={(e) =>
                  setFormData({ ...formData, dueTime: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            disabled={
              !formData.title || !formData.assignedTo || !formData.dueDate
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Task Status</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusData.status}
                  label="Status"
                  onChange={(e) =>
                    setStatusData({ ...statusData, status: e.target.value })
                  }
                >
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {statusData.status === "COMPLETED" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Completion Notes"
                  multiline
                  rows={3}
                  value={statusData.completionNotes}
                  onChange={(e) =>
                    setStatusData({
                      ...statusData,
                      completionNotes: e.target.value,
                    })
                  }
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={!statusData.status}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagementPage;
