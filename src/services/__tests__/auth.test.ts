// auth.test.js

import { hashPassword } from "../../utils/auth";

describe("auth", () => {
  describe("hashPassword", () => {
    it("hashes the given password using SHA-256", () => {
      const password = "password123";
      const hashed = hashPassword(password);

      expect(hashed).toMatch(/^[a-f0-9]{64}$/); // hex string
      expect(hashed).not.toBe(password);
    });
  });
});
