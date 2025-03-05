module.exports = [
  {
    languageOptions: {
      globals: {
        browser: true,
        node: true,
        es2021: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": {
        rules: {
          "@typescript-eslint/indent": ["error", 2],
          "@typescript-eslint/linebreak-style": ["error", "unix"],
          "@typescript-eslint/quotes": ["error", "single"],
          "@typescript-eslint/semi": ["error", "always"],
        },
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
  },
];
