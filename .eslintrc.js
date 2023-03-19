module.exports = {
  ignorePatterns: ['dist/**', 'coverage/**'],
  rules: {
    'no-non-null-assertion': 0,
  },
  overrides: [
    {
      files: ['**/*.ts'],
      extends: ['@waldronmatt/eslint-config/ts'],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ['**/*.js'],
      extends: ['@waldronmatt/eslint-config'],
    },
  ],
};
