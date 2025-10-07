import { createAuditLog } from "../services/auditService.js";

// Middleware to automatically log API requests
export const auditMiddleware = async (req, res, next) => {
  // Store the original res.json method
  const originalJson = res.json.bind(res);

  // Store request start time
  const startTime = Date.now();

  // Override res.json to capture response before sending
  res.json = function (body) {
    // Calculate request duration
    const duration = Date.now() - startTime;

    // Don't log certain routes to avoid clutter
    const skipRoutes = [
      "/api/auth/verify",
      "/api/notifications/unread-count",
      "/health",
    ];

    const shouldLog = !skipRoutes.some((route) => req.path.startsWith(route));

    if (shouldLog && req.user) {
      // Determine action based on HTTP method and path
      let action = "READ";
      let actionCategory = "SYSTEM";
      let severity = "LOW";
      let description = `${req.method} ${req.path}`;

      // Map HTTP methods to actions
      switch (req.method) {
        case "POST":
          action = "CREATE";
          severity = "MEDIUM";
          break;
        case "PUT":
        case "PATCH":
          action = "UPDATE";
          severity = "MEDIUM";
          break;
        case "DELETE":
          action = "DELETE";
          severity = "HIGH";
          break;
        default:
          action = "READ";
          severity = "LOW";
      }

      // Determine action category based on path
      if (req.path.includes("/patient")) {
        actionCategory = "PATIENT_CARE";
      } else if (req.path.includes("/vital-signs")) {
        actionCategory = "VITAL_SIGNS";
      } else if (req.path.includes("/medication")) {
        actionCategory = "MEDICATION";
      } else if (req.path.includes("/document")) {
        actionCategory = "DOCUMENTATION";
      } else if (req.path.includes("/auth")) {
        actionCategory = "AUTHENTICATION";
      } else if (
        req.path.includes("/user") ||
        req.path.includes("/bed") ||
        req.path.includes("/audit")
      ) {
        actionCategory = "ADMINISTRATION";
      }

      // Extract patientId from params or body if available
      const patientId =
        req.params.patientId ||
        req.body.patientId ||
        req.query.patientId ||
        null;

      // Extract recordId and tableName if available
      const recordId = req.params.id || req.params.recordId || null;
      let tableName = null;

      // Infer table name from path
      if (req.path.includes("/patient")) tableName = "patients";
      else if (req.path.includes("/bed")) tableName = "beds";
      else if (req.path.includes("/user")) tableName = "users";
      else if (req.path.includes("/document")) tableName = "documents";
      else if (req.path.includes("/medication")) tableName = "medications";
      else if (req.path.includes("/vital-signs")) tableName = "vital_signs";

      // Determine success based on status code
      const success = res.statusCode >= 200 && res.statusCode < 300;

      // Create enhanced description
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyKeys = Object.keys(req.body).filter(
          (key) => !key.toLowerCase().includes("password")
        );
        if (bodyKeys.length > 0) {
          description += ` | Fields: ${bodyKeys.join(", ")}`;
        }
      }

      // Log the request asynchronously (don't wait for it)
      createAuditLog({
        userId: req.user.id,
        action,
        actionCategory,
        description,
        severity,
        tableName,
        recordId,
        patientId,
        oldValues: null, // Not available in middleware
        newValues: req.method !== "GET" ? req.body : null,
        changedFields: null, // Not available in middleware
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("user-agent"),
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        duration,
        success,
        errorMessage: !success && body.message ? body.message : null,
        metadata: {
          query: req.query,
          params: req.params,
        },
      }).catch((error) => {
        console.error("Error creating audit log:", error);
      });
    }

    // Call the original res.json method
    return originalJson(body);
  };

  next();
};

// Middleware to log authentication events
export const auditAuthMiddleware = (action) => {
  return async (req, res, next) => {
    // Store the original res.json method
    const originalJson = res.json.bind(res);

    // Override res.json to capture response
    res.json = function (body) {
      // Only log after response is sent
      if (req.user || action === "LOGIN" || action === "LOGIN_FAILED") {
        const success = res.statusCode >= 200 && res.statusCode < 300;

        // Log authentication event
        createAuditLog({
          userId: req.user ? req.user.id : null,
          action,
          actionCategory: "AUTHENTICATION",
          description: `User ${action.toLowerCase().replace("_", " ")}`,
          severity: success ? "LOW" : "MEDIUM",
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("user-agent"),
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          success,
          errorMessage: !success && body.message ? body.message : null,
          metadata: {
            username: req.body.username,
          },
        }).catch((error) => {
          console.error("Error creating auth audit log:", error);
        });
      }

      return originalJson(body);
    };

    next();
  };
};
