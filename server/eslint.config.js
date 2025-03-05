import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ts.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: "latest",
    },
    plugins: { "@typescript-eslint": ts },
    rules: {
      "@typescript-eslint/indent": ["error", 2],
      "@typescript-eslint/linebreak-style": ["error", "unix"],
      "@typescript-eslint/quotes": ["error", "single"],
      "@typescript-eslint/semi": ["error", "always"],
    },
  },
];
