import { expect, test, describe } from "vitest";
import { checkFileExists } from "./utils";

describe("checkFileExists", () => {
  test("should return false if there's no file", async () => {
    expect(await checkFileExists("non-existing-file.asdfg")).toBe(false);
  });
  test("should return true if there's a file", async () => {
    expect(await checkFileExists("package.json")).toBe(true);
  });
});
