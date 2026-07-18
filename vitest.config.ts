import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["content/**/*.test.ts", "content/**/__tests__/**/*.test.ts"],
  },
});
