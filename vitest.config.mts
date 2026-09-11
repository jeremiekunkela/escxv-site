import { defineConfig } from "vitest/config";

/**
 * Les tests portent sur les fonctions pures du contact : validation, mise en
 * forme, decision de renvoi. Aucune ne touche au reseau ni au DOM, d'ou
 * l'environnement Node.
 *
 * `tsconfigPaths` fait resoudre les alias `@/` comme le fait Next.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
