import express, { urlencoded } from "express";
import userRoutes from "./routes/userRoutes";
import { db, MONGODB_URI } from "./config/database";
import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import redoc from "redoc-express";
import { RegisterRoutes } from "./routes/routes";

/**
 * Initializes Express app and connects to MongoDB database.
 * Exports app and db instances.
 */
mongoose.connect(MONGODB_URI);

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(urlencoded({ extended: true}));

// Routes
// app.use(userRoutes);
RegisterRoutes(app);

app.get(
  "/docs",
  redoc({
    title: "API Docs",
    specUrl: "/swagger.json",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#1234F6",
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: "15px",
          lineHeight: "1.5",
          code: {
            code: "#FF11CC",
            backgroundColor: "#AABBCC",
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

db.once("open", () => {
  console.log(`MongoDB connected to ${MONGODB_URI}`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.use(errorHandler);

export default app;
