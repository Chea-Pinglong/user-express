// userController.test.ts

import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../../models/contact";

let mongoServer: MongoMemoryServer;
let server: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  server = app.listen();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();

  server.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("User Controller", () => {
  describe("POST /", () => {
    it("should create a new user", async () => {
      const data = {
        name: "John Doe",
        email: "john@test.com",
        password: "password123",
      };

      const res = await request(server)
        .post("/")
        .send(data)
        .expect(201)
        .catch((err) => {
          throw err;
        });

      const users = await User.find();
      expect(users).toHaveLength(1);
      expect(users[0].name).toBe("John Doe");
    });
  });

  // Other tests...
});
