var fs = require('fs');
var path = require('path');
var renderTemplate = require('../utils/templateRenderer');

// Load the calculation JSON data
const calculationData = JSON.parse(fs.readFileSync(path.join(__dirname, '../api/v0.1/tb40/calculation.json'), 'utf8'));

function handleCalculation(type, version) {
  const template = calculationData.presentation.julukan.data;
  const renderedText = renderTemplate(template, calculationData);

  // Your calculation logic here
  return {
    message: `Calculation for ${type} in version ${version}`,
    data: renderedText
  };
}

module.exports = {
  handleCalculation
};