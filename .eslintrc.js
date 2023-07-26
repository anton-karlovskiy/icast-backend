
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'google'
    /**
     * TODO:
     * It looks like prettier is not working properly.
     * It overrides some rules from above extends.
     */
    // 'plugin:prettier/recommended'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'import',
    'babel'
  ],
  rules: {
    // ESLinting rules
    'comma-dangle': ['error', 'never'],
    'no-console': 'warn',
    indent: ['error', 2],
    'quote-props': ['error', 'as-needed'],
    'capitalized-comments': 'off',
    'max-len': ['warn',
      {
        code: 130
      } // 130 on GitHub, 80 on npmjs.org for README.md code blocks
    ],
    'arrow-parens': ['error', 'as-needed'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never'
      }
    ],
    'no-negated-condition': 'warn',
    'spaced-comment': ['error', 'always',
      {
        exceptions: ['/']
      }
    ],
    'no-invalid-this': 0,
    'babel/no-invalid-this': 1,
    // MEMO: They are set by extends
    // 'quotes': ['error', 'single'],
    // 'semi': ['error', 'always'],
    // 'comma-spacing': ['error', { 'before': false, 'after': true }],
    'object-curly-spacing': ['error', 'always'],
    // 'no-trailing-spaces': ['error', { 'skipBlankLines': false, 'ignoreComments': false }],
    // 'no-multi-spaces': 'error',
    // 'space-after-keywords': ['error', 'always'],
    // 'keyword-spacing': ['error', { before: true, after: true }],
    // 'block-spacing': ['error', 'never'],
    // 'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    // 'space-in-parens': ['error', 'never'],
    // 'capitalized-comments': ['warn', 'always', {
    //   'ignorePattern': 'pragma|ignored',
    //   'ignoreInlineComments': true
    // }],

    // Prettier linting rules
    /**
     * TODO:
     * It looks like prettier is not working properly.
     * It overrides some rules from above extends.
     */
    // 'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'import/exports-last': 'error'
  }
};
