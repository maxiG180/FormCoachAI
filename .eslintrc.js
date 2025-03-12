module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Downgrade errors to warnings
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn",
  },
  ignorePatterns: [
    // Ignore specific problematic files if needed
    "src/lib/utils/poseDrawing.ts",
    "src/providers/pageTransitionProvider.tsx",
  ],
};
