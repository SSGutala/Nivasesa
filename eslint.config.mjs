import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Allow require imports in prisma/lib
  {
    files: ["prisma/**/*.js", "lib/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off"
    }
  },
  // Custom rules
  {
    rules: {
      // Allow unused vars starting with _
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Prefer const over let where possible
      "prefer-const": "warn",
      // No console.log in production code (warn only)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Enforce consistent imports
      "import/order": ["warn", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "never",
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores
    "node_modules/**",
    "prisma/dev.db",
    "__tests__/**",
  ]),
]);

export default eslintConfig;
