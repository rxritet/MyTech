import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
]);
