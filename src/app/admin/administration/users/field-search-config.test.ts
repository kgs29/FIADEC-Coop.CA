// __tests__/fieldConfig.test.ts
import { describe, it, expect } from "vitest";
import { fieldConfig, emptyModel } from "./field-search-config";

// Mock i18n.t pour retourner simplement la clé
import i18n from "@/locale/i18n";
i18n.t = (key: string) => key;

describe("fieldConfig et emptyModel", () => {
  it("fieldConfig doit contenir les champs attendus avec type 'string'", () => {
    const expectedFields = [
      "username",
      "last_name",
      "first_name",
      "email",
      "phone_number",
    ];

    expectedFields.forEach((field) => {
      expect(fieldConfig[field]).toBeDefined();
      expect(fieldConfig[field]?.type).toBe("string");
    });
  });

  it("emptyModel doit contenir les mêmes clés avec des valeurs vides", () => {
    const expectedFields = [
      "username",
      "last_name",
      "first_name",
      "email",
      "phone_number",
    ];

    expectedFields.forEach((field) => {
      expect(emptyModel[field]).toBe("");
    });
  });
});