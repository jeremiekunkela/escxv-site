import { describe, expect, it } from "vitest";
import { removeFilterValue, toggleFilterValue } from "@/lib/utils/filters";

describe("toggleFilterValue", () => {
  it("coche une valeur absente sans toucher au tableau recu", () => {
    const values = ["lundi"];

    expect(toggleFilterValue(values, "mardi")).toEqual(["lundi", "mardi"]);
    expect(values).toEqual(["lundi"]);
  });

  it("decoche une valeur presente", () => {
    expect(toggleFilterValue(["lundi", "mardi"], "lundi")).toEqual(["mardi"]);
  });
});

describe("removeFilterValue", () => {
  it("retire une valeur du critere vise, sans toucher aux autres", () => {
    const filters = {
      publics: ["enfants"],
      days: ["lundi", "mercredi"],
      locationIds: ["keller"],
    };

    expect(removeFilterValue(filters, "days", "lundi")).toEqual({
      publics: ["enfants"],
      days: ["mercredi"],
      locationIds: ["keller"],
    });
    expect(filters.days).toEqual(["lundi", "mercredi"]);
  });

  /** Un critere textuel voisine avec les listes : il ne doit pas bouger. */
  it("laisse intacts les champs qui ne sont pas des listes", () => {
    const filters = { sportSlugs: ["judo"], query: "gymnase" };

    expect(removeFilterValue(filters, "sportSlugs", "judo")).toEqual({
      sportSlugs: [],
      query: "gymnase",
    });
  });
});
