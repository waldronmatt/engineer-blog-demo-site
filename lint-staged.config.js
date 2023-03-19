/* eslint-disable sonarjs/no-duplicate-string */
const config = require('@waldronmatt/lint-staged-config');

module.exports = {
  // check for credentials
  '*': ['secretlint'],
  ...config,
  // lint and fix changed css and scss files
  '*.{css,scss}': ['prettier --cache --write', 'stylelint --cache --fix'],
};
