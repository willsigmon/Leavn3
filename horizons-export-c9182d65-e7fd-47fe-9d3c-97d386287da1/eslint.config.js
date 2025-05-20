export default [
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["node_modules/**"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      "eol-last": ["error", "always"]
    }
  }
];
