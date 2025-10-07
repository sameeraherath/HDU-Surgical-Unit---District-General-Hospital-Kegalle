import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
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
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import {
  fetchAuditLogs,
  fetchAuditLogById,
  fetchAuditStatistics,
  fetchCriticalEvents,
  fetchFailedActions,
  exportAuditLogs,
  setFilters,
  resetFilters,
  clearSelectedLog,
} from "../features/audit/auditSlice";
import { formatDistanceToNow } from "date-fns";

const AuditLogPage = () => {
  const dispatch = useDispatch();
  const {
    auditLogs,
    selectedLog,
    statistics,
    criticalEvents,
    failedActions,
    pagination,
    filters,
    loading,
    error,
  } = useSelector((state) => state.audit);

  const [tabValue, setTabValue] = useState(0);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    action: "",
    actionCategory: "",
    severity: "",
    success: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    dispatch(fetchAuditLogs({ page: 1, limit: 50 }));
    dispatch(fetchAuditStatistics());
    dispatch(fetchCriticalEvents({ limit: 10, hours: 24 }));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 2) {
      dispatch(fetchFailedActions({ page: 1, limit: 50, hours: 24 }));
    }
  };

  const handlePageChange = (event, newPage) => {
    dispatch(
      fetchAuditLogs({ ...filters, page: newPage + 1, limit: pagination.limit })
    );
  };

  const handleRowsPerPageChange = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(fetchAuditLogs({ ...filters, page: 1, limit: newLimit }));
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(
      fetchAuditLogs({
        ...filters,
        ...localFilters,
        page: 1,
        limit: pagination.limit,
      })
    );
  };

  const handleResetFilters = () => {
    setLocalFilters({
      action: "",
      actionCategory: "",
      severity: "",
      success: "",
      startDate: "",
      endDate: "",
    });
    dispatch(resetFilters());
    dispatch(fetchAuditLogs({ page: 1, limit: pagination.limit }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchAuditLogs({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      })
    );
    dispatch(fetchAuditStatistics());
    dispatch(fetchCriticalEvents({ limit: 10, hours: 24 }));
  };

  const handleViewDetails = (logId) => {
    dispatch(fetchAuditLogById(logId));
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    dispatch(clearSelectedLog());
  };

  const handleExport = (format) => {
    dispatch(
      exportAuditLogs({
        startDate: localFilters.startDate,
        endDate: localFilters.endDate,
        format,
      })
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "error";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      case "LOW":
        return "success";
      default:
        return "default";
    }
  };

  const getActionCategoryColor = (category) => {
    const colors = {
      AUTHENTICATION: "primary",
      PATIENT_CARE: "secondary",
      VITAL_SIGNS: "error",
      MEDICATION: "warning",
      DOCUMENTATION: "info",
      ADMINISTRATION: "default",
      SYSTEM: "default",
      SECURITY: "error",
    };
    return colors[category] || "default";
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Audit Logs
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("json")}
            sx={{ mr: 1 }}
          >
            Export JSON
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport("csv")}
            sx={{ mr: 1 }}
          >
            Export CSV
          </Button>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Logs
                </Typography>
                <Typography variant="h4">{statistics.totalLogs}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Critical Events
                </Typography>
                <Typography variant="h4" color="error">
                  {statistics.severityBreakdown?.CRITICAL || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Failed Actions
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {statistics.failedActions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Unique Users
                </Typography>
                <Typography variant="h4">{statistics.uniqueUsers}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Logs" />
        <Tab
          label="Critical Events"
          icon={<WarningIcon />}
          iconPosition="end"
        />
        <Tab label="Failed Actions" icon={<ErrorIcon />} iconPosition="end" />
      </Tabs>

      <Paper sx={{ p: 2 }}>
        {/* Filters */}
        {tabValue === 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <FilterListIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Action"
                  value={localFilters.action}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, action: e.target.value })
                  }
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="CREATE">Create</MenuItem>
                  <MenuItem value="READ">Read</MenuItem>
                  <MenuItem value="UPDATE">Update</MenuItem>
                  <MenuItem value="DELETE">Delete</MenuItem>
                  <MenuItem value="LOGIN">Login</MenuItem>
                  <MenuItem value="LOGOUT">Logout</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={localFilters.actionCategory}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      actionCategory: e.target.value,
                    })
                  }
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="AUTHENTICATION">Authentication</MenuItem>
                  <MenuItem value="PATIENT_CARE">Patient Care</MenuItem>
                  <MenuItem value="VITAL_SIGNS">Vital Signs</MenuItem>
                  <MenuItem value="MEDICATION">Medication</MenuItem>
                  <MenuItem value="DOCUMENTATION">Documentation</MenuItem>
                  <MenuItem value="ADMINISTRATION">Administration</MenuItem>
                  <MenuItem value="SECURITY">Security</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Severity"
                  value={localFilters.severity}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      severity: e.target.value,
                    })
                  }
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="CRITICAL">Critical</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="LOW">Low</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={localFilters.success}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      success: e.target.value,
                    })
                  }
                  size="small"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Success</MenuItem>
                  <MenuItem value="false">Failed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  type="date"
                  fullWidth
                  label="Start Date"
                  value={localFilters.startDate}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      startDate: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  type="date"
                  fullWidth
                  label="End Date"
                  value={localFilters.endDate}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      endDate: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  sx={{ mr: 1 }}
                >
                  Apply Filters
                </Button>
                <Button variant="outlined" onClick={handleResetFilters}>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* All Logs Table */}
            {tabValue === 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(log.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDistanceToNow(new Date(log.timestamp), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.userName || log.user?.username}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {log.userRole || log.user?.role}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={log.action} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.actionCategory}
                            color={getActionCategoryColor(log.actionCategory)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 300 }}
                          >
                            {log.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.severity}
                            color={getSeverityColor(log.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.success ? "Success" : "Failed"}
                            color={log.success ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={pagination.total}
                  page={pagination.page - 1}
                  onPageChange={handlePageChange}
                  rowsPerPage={pagination.limit}
                  onRowsPerPageChange={handleRowsPerPageChange}
                />
              </TableContainer>
            )}

            {/* Critical Events Table */}
            {tabValue === 1 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {criticalEvents.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {log.userName || log.user?.username}
                        </TableCell>
                        <TableCell>
                          <Chip label={log.action} size="small" />
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.severity}
                            color={getSeverityColor(log.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Failed Actions Table */}
            {tabValue === 2 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Error</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {failedActions.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {log.userName || log.user?.username}
                        </TableCell>
                        <TableCell>
                          <Chip label={log.action} size="small" />
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="error">
                            {log.errorMessage}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(log.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Timestamp
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  User
                </Typography>
                <Typography variant="body1">
                  {selectedLog.userName} ({selectedLog.userRole})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Action
                </Typography>
                <Chip label={selectedLog.action} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Chip
                  label={selectedLog.actionCategory}
                  color={getActionCategoryColor(selectedLog.actionCategory)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedLog.description}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Severity
                </Typography>
                <Chip
                  label={selectedLog.severity}
                  color={getSeverityColor(selectedLog.severity)}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={selectedLog.success ? "Success" : "Failed"}
                  color={selectedLog.success ? "success" : "error"}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {selectedLog.duration}ms
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  IP Address
                </Typography>
                <Typography variant="body1">{selectedLog.ipAddress}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Endpoint
                </Typography>
                <Typography variant="body1">
                  {selectedLog.method} {selectedLog.endpoint}
                </Typography>
              </Grid>
              {selectedLog.errorMessage && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Error Message
                  </Typography>
                  <Typography variant="body1" color="error">
                    {selectedLog.errorMessage}
                  </Typography>
                </Grid>
              )}
              {selectedLog.changedFields &&
                selectedLog.changedFields.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Changed Fields
                    </Typography>
                    <Typography variant="body1">
                      {selectedLog.changedFields.join(", ")}
                    </Typography>
                  </Grid>
                )}
              {selectedLog.metadata && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Metadata
                  </Typography>
                  <Paper sx={{ p: 1, bgcolor: "grey.100" }}>
                    <pre style={{ margin: 0, fontSize: "0.875rem" }}>
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogPage;
