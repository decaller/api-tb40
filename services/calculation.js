var fs = require("fs");
var path = require("path");
var renderTemplate = require("../utils/templateRenderer");

// Load the calculation JSON data
const calculationData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../api/v0.1/tb40/calculation.json"),
    "utf8"
  )
);

function handleCalculation(req) {
  const { version, type } = req.params;
  const { parts } = req.body;
  const { umum, tb40 } = parts;

  console.log(parts)
  // Perform your calculation logic here using the provided data
  // For example, you can calculate averages, ranks, etc.

  // Render the template with the provided data
  //   const template = calculationData.presentation.julukan.data;
  //   const renderedText = renderTemplate(template, { ...calculationData, parts });

  return {
    message: `Calculation for ${type} in version ${version}`,
    data: umum,
  };
}

module.exports = {
  handleCalculation,
};
