import { describe, it, expect } from "vitest";
import { BaseInterface } from "./base";

describe("Base Types", () => {
  describe("BaseInterface", () => {
    it("should accept valid base interface data", () => {
      const base: BaseInterface = {
        id: "1",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      expect(base.id).toBe("1");
      expect(base.created_at).toBe("2023-01-01T00:00:00Z");
      expect(base.updated_at).toBe("2023-01-01T00:00:00Z");
    });

    it("should handle different ID formats", () => {
      const bases: BaseInterface[] = [
        { id: "1", created_at: "2023-01-01", updated_at: "2023-01-02" },
        { id: "abc", created_at: "2023-12-31T23:59:59Z", updated_at: "2024-01-01T00:00:00Z" },
        { id: "uuid-123-456-789", created_at: "2023-01-01", updated_at: "2023-01-01" },
        { id: "0", created_at: "2023-01-01", updated_at: "2023-01-01" },
      ];

      bases.forEach((base) => {
        expect(typeof base.id).toBe("string");
        expect(typeof base.created_at).toBe("string");
        expect(typeof base.updated_at).toBe("string");
        expect(base.id.length).toBeGreaterThan(0);
        expect(base.created_at.length).toBeGreaterThan(0);
        expect(base.updated_at.length).toBeGreaterThan(0);
      });
    });

    it("should handle different date formats", () => {
      const bases: BaseInterface[] = [
        { id: "1", created_at: "2023-01-01", updated_at: "2023-01-02" },
        { id: "2", created_at: "2023-01-01T00:00:00Z", updated_at: "2023-01-01T12:00:00Z" },
        { id: "3", created_at: "2023-12-31T23:59:59.999Z", updated_at: "2024-01-01T00:00:00.000Z" },
        { id: "4", created_at: "2023-01-01T00:00:00+00:00", updated_at: "2023-01-01T00:00:00+00:00" },
      ];

      bases.forEach((base) => {
        expect(typeof base.created_at).toBe("string");
        expect(typeof base.updated_at).toBe("string");
        expect(base.created_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
        expect(base.updated_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
      });
    });

    it("should handle edge cases", () => {
      const edgeCases: BaseInterface[] = [
        { id: "", created_at: "2023-01-01", updated_at: "2023-01-01" },
        { id: "a", created_at: "2023-01-01", updated_at: "2023-01-01" },
        { id: "very-long-id-with-many-characters-123456789", created_at: "2023-01-01", updated_at: "2023-01-01" },
        { id: "123", created_at: "2023-01-01", updated_at: "2023-01-01" },
      ];

      edgeCases.forEach((base) => {
        expect(typeof base.id).toBe("string");
        expect(typeof base.created_at).toBe("string");
        expect(typeof base.updated_at).toBe("string");
      });
    });

    it("should ensure all required fields are present", () => {
      const base: BaseInterface = {
        id: "test-id",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      expect(base).toHaveProperty("id");
      expect(base).toHaveProperty("created_at");
      expect(base).toHaveProperty("updated_at");
      expect(Object.keys(base)).toHaveLength(3);
    });

    it("should allow extension by other interfaces", () => {
      interface ExtendedInterface extends BaseInterface {
        name: string;
        description?: string;
      }

      const extended: ExtendedInterface = {
        id: "1",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        name: "Test Item",
      };

      expect(extended.id).toBe("1");
      expect(extended.name).toBe("Test Item");
      expect(extended.description).toBeUndefined();
    });

    it("should handle timestamp consistency", () => {
      const base: BaseInterface = {
        id: "1",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      // Created and updated can be the same
      expect(base.created_at).toBe(base.updated_at);

      const updatedLater: BaseInterface = {
        id: "2",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-02T00:00:00Z",
      };

      // Updated should be after created
      expect(updatedLater.updated_at > updatedLater.created_at).toBe(true);
    });

    it("should validate string types", () => {
      const base: BaseInterface = {
        id: "1",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      expect(typeof base.id).toBe("string");
      expect(typeof base.created_at).toBe("string");
      expect(typeof base.updated_at).toBe("string");

      // TypeScript ensures type safety at compile time
      // Invalid types would not compile
      const validId: string = base.id;
      const validCreatedAt: string = base.created_at;
      const validUpdatedAt: string = base.updated_at;
      
      expect(typeof validId).toBe("string");
      expect(typeof validCreatedAt).toBe("string");
      expect(typeof validUpdatedAt).toBe("string");
    });

    it("should be usable in arrays", () => {
      const bases: BaseInterface[] = [
        { id: "1", created_at: "2023-01-01", updated_at: "2023-01-01" },
        { id: "2", created_at: "2023-01-02", updated_at: "2023-01-02" },
        { id: "3", created_at: "2023-01-03", updated_at: "2023-01-03" },
      ];

      expect(bases).toHaveLength(3);
      expect(bases[0].id).toBe("1");
      expect(bases[1].id).toBe("2");
      expect(bases[2].id).toBe("3");

      // Should be able to filter
      const filtered = bases.filter((base) => base.id === "2");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("2");

      // Should be able to map
      const ids = bases.map((base) => base.id);
      expect(ids).toEqual(["1", "2", "3"]);
    });

    it("should be usable as function parameters", () => {
      const processBase = (base: BaseInterface): string => {
        return `Base ${base.id} created at ${base.created_at}`;
      };

      const base: BaseInterface = {
        id: "123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
      };

      const result = processBase(base);
      expect(result).toBe("Base 123 created at 2023-01-01T00:00:00Z");
    });

    it("should be usable as return type", () => {
      const createBase = (id: string): BaseInterface => {
        const now = new Date().toISOString();
        return {
          id,
          created_at: now,
          updated_at: now,
        };
      };

      const base = createBase("test-id");
      expect(base.id).toBe("test-id");
      expect(typeof base.created_at).toBe("string");
      expect(typeof base.updated_at).toBe("string");
    });
  });
});
