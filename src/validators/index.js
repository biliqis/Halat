/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const baseValidator = require('./base');

const allRules = {};
const rules = fs.readdirSync(path.join(__dirname));

rules.forEach((h) => {
  // eslint-disable-next-line global-require
  const validator = require(`./${h}`);
  Object.keys(validator).forEach((rule) => {
    allRules[rule] = (req, res, next) => baseValidator(validator[rule], req, res, next);
  });
});

function get(name) {
  if (!allRules[name]) {
    throw new Error(`Invalid Rule Name ${name}`);
  }
  return allRules[name];
}

module.exports = get;
