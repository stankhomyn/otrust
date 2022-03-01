module.exports = {
  "ignorePatterns": ["build/**"],
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": ["airbnb", "airbnb-typescript", "plugin:prettier/recommended"],
  "plugins": ["prettier", "testing-library", "jest-dom"],
  "globals": {},
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  },
  "rules": {
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/order": [2, { "groups": ["builtin", "external"], "newlines-between": "always" }],
    "import/prefer-default-export": "off",
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "consistent-return": "off",
    "func-names": "off",
    "max-len": "off",
    "no-param-reassign": "off",
    "no-process-exit": "off",
    "no-return-await": "off",
    "no-shadow": ["warn", { "builtinGlobals": false, "hoist": "functions", "allow": [] }],
    "no-underscore-dangle": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "req|res|next|val" }],
    "no-console": "warn",
    "no-debugger": "error",
    "object-shorthand": "off",
    "spaced-comment": "off",
    "space-infix-ops": [2],
    "no-restricted-syntax": "warn"
  }
}
