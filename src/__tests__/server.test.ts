import { describe, it, expect } from "vitest";
import { createMcpServer } from "../index.js";

describe("MCP Server", () => {
  it("creates server instance", () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
  });
});
