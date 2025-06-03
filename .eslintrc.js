import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import reactSecurity from "eslint-plugin-react-security";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      security: security,
      "react-security": reactSecurity,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Security rules
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-buffer-noassert": "warn",
      "security/detect-eval-with-expression": "error",
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
      "react-security/detect-dangerous-html": "error",
      "react-security/no-find-dom-node": "error",
      "react-security/no-refs": "warn",
      "react-security/no-dangerously-set-innerhtml": "error",

      // Additional security rules for React apps
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-prototype-builtins": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-alert": "warn",
      "no-debugger": "error",

      // Preventing potential data leaks
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript specific security
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",

      // Preventing secrets in code
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/([a-zA-Z0-9+/]{32,})/]",
          message:
            "Potential credential found in code. Remove credentials from code.",
        },
      ],
    },
  }
);
