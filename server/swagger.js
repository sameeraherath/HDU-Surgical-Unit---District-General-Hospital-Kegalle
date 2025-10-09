import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));

/**
 * Setup Swagger UI for API documentation
 * @param {Express} app - Express application instance
 */
export const setupSwagger = (app) => {
  // Swagger UI options
  const options = {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "HDU API Documentation",
  };

  // Serve Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );

  console.log(
    "📚 API Documentation available at http://localhost:5000/api-docs"
  );
};
