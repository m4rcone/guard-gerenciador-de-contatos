import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testTimeout: 60000,
};

export default createJestConfig(config);
