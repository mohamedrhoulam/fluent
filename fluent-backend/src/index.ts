import express from "express";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.ts";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Tracker API",
      version: "1.0.0",
      description: "API documentation for the Task Tracker application",
    },
    servers: [
      {
        url: `http://localhost:5000`,
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          required: ["title"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the task",
            },
            title: {
              type: "string",
              description: "The title of the task",
            },
            description: {
              type: "string",
              description: "The description of the task",
            },
            completed: {
              type: "boolean",
              description: "The completion status of the task",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "The due date of the task",
            },
            location: {
              type: "string",
              description: "The location of the task",
            },
            participants: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The participants of the task",
            },
            subtasks: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Subtask",
              },
              description: "The subtasks of the task",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The creation date of the task",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The last update date of the task",
            },
          },
        },
        Subtask: {
          type: "object",
          required: ["title"],
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the subtask",
            },
            title: {
              type: "string",
              description: "The title of the subtask",
            },
            description: {
              type: "string",
              description: "The description of the subtask",
            },
            completed: {
              type: "boolean",
              description: "The completion status of the subtask",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "The due date of the subtask",
            },
            location: {
              type: "string",
              description: "The location of the subtask",
            },
            participants: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The participants of the subtask",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The creation date of the subtask",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The last update date of the subtask",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/routes/*.ts",
    "./src/models/*.ts",
    "./dist/routes/*",
    "./src/controllers/*.ts",
  ],
};

app.get("/", (req, res) => {
  res.send("Task Tracker API is running");
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use("/api/tasks", taskRoutes);

mongoose
  .connect("mongodb://localhost:27017/fluentdb", {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
