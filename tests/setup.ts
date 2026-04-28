import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Clear localStorage between tests
beforeEach(() => {
  localStorage.clear();
});
