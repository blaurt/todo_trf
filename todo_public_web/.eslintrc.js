const TAB_WIDTH = 2;

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "simple-import-sort"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "next/typescript",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/prefer-default-export": "off",
    "no-console": "warn",
    "no-plusplus": "off",
    "class-methods-use-this": "off",
    "max-classes-per-file": "off",
    "max-len": [
      "warn",
      {
        code: 120,
        tabWidth: TAB_WIDTH,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: false,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "simple-import-sort/imports": "warn",
    "simple-import-sort/exports": "warn",
    "lines-between-class-members": ["warn", "always"],
    "object-curly-newline": [
      "warn",
      {
        ObjectExpression: {
          minProperties: 2,
          consistent: true,
        },
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "comma-dangle": [
      "warn",
      {
        arrays: "always",
        objects: "always",
        imports: "always",
        exports: "always",
        functions: "never",
      },
    ],
    "multiline-ternary": ["warn", "always"],
    "operator-linebreak": ["warn", "before"],
    "padding-line-between-statements": [
      "warn",
      { blankLine: "always", prev: "if", next: "*" },
    ],
    "array-element-newline": ["warn", "always"],
    "array-bracket-newline": ["warn", { multiline: true }],
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "block-spacing": "warn",
    "newline-before-return": "warn",
    "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],
    indent: ["warn", TAB_WIDTH, { ignoredNodes: ["PropertyDefinition"] }],
    "object-property-newline": [
      "warn",
      { allowAllPropertiesOnSameLine: false },
    ],
    "prefer-const": "off",
    "@typescript-eslint/no-unused-private-class-members": "off",
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*repository.ts", "*service.ts", "*handler.ts", "*controller.ts"],
      rules: {
        "@typescript-eslint/explicit-member-accessibility": [
          "error",
          {
            accessibility: "explicit",
            overrides: {
              accessors: "off",
              constructors: "no-public",
              methods: "explicit",
              properties: "explicit",
              parameterProperties: "explicit",
            },
          },
        ],
      },
    },
  ],
};
