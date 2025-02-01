import { describe, it, expect } from "vitest";
import axios from "axios";

describe("Dummy Test", () => {
  it("should always pass", () => {
    expect(true).toBe(true);
  });
});

describe("Client Health Check", () => {
  it("should verify client is running", async () => {
    try {
      // The default Vite development server port
      const response = await axios.get("http://localhost:5173");
      expect(response.status).toBe(200);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Client application is not running");
    }
  });
});
