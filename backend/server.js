import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import booksRoutes from "./routes/books.js";
import authorsRoutes from "./routes/authors.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Za __dirname u ES modu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rute
app.use("/api/books", booksRoutes);
app.use("/api/authors", authorsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book API",
      version: "1.0.0",
      description: "CRUD operacije za knjige, autore i korisnike",
    },
    servers: [{ url: "http://localhost:" + PORT }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "./routes/*.js")], // 👈 skenira sve rute
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`✅ Server radi na http://localhost:${PORT}`);
  console.log(`📖 Swagger docs: http://localhost:${PORT}/api/docs`);
});
