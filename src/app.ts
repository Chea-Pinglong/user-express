import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import loggerMiddleware from "./middlewares/logger-handler";
import redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import { RegisterRoutes } from "./routes/routes";


const app = express();

// =======================
// Global Middlewares
// =======================

// Access Request Body (JSON)
app.use(express.json());
app.use(express.static("public"));

// Logger
app.use(loggerMiddleware);

// ========================
// ========================
RegisterRoutes(app);

// API Documentation
app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/swagger.json",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#6EC5AB",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#87E8C7",
            backgroundColor: "#4D4D4E",
          },
        },
        menu: {
          backgroundColor: "#ffffff",
        },
      },
    },
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// Global Error Handler
// ========================
app.use(errorHandler);

export default app;
