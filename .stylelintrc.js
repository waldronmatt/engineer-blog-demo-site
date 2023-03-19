module.exports = {
  ignoreFiles: ['dist/**', 'coverage/**', 'src/scss/layouts/_header-nav.scss'],
  extends: '@waldronmatt/stylelint-config/scss',
  rules: {
    'a11y/media-prefers-reduced-motion': undefined,
  },
  overrides: [
    {
      files: ['**/*.css'],
      extends: '@waldronmatt/stylelint-config',
    },
  ],
};
