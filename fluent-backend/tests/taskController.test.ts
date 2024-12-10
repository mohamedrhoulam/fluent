import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import taskRoutes from "../src/routes/taskRoutes";

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/fluent_test", {
        
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Task API", () => {
    let taskId: string;

    it("should create a new task", async () => {
        const response = await request(app)
            .post("/api/tasks")
            .send({ title: "Test Task", description: "Test Description" });
        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Test Task");
        taskId = response.body._id;
    });

    it("should get all tasks", async () => {
        const response = await request(app).get("/api/tasks");
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should update a task", async () => {
        const response = await request(app)
            .put(`/api/tasks/${taskId}`)
            .send({ title: "Updated Task", description: "Updated Description" });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Updated Task");
    });

    it("should delete a task", async () => {
        const response = await request(app).delete(`/api/tasks/${taskId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Task deleted");
    });

    it("should return 404 for non-existing task", async () => {
        const response = await request(app).get("/api/tasks/invalidId");
        expect(response.status).toBe(404);
    });
});
