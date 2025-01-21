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

  // Load the calculation data for tb40
  const tb40Calc = calculationData.parts.tb40;
  const tb40Result = {};

  // Map the results to the corresponding pillars based on the group
  Object.entries(tb40Calc.result).forEach(([key, value]) => {
    tb40Result[key] = tb40Calc.pillars.filter(
      (pillar) => pillar.pillar.group === key
    );
  });

  // Calculate the scores for each pillar
  tb40Calc.groupLinage.forEach((group, index) => {
    if (index === 0) {
      // Assign scores from the tb40 array to the first group of pillars
      tb40Result[group.child].forEach((pillar) => {
        pillar.score = tb40[pillar.questionIndex - 1];
      });
    }

    // Calculate the average score for parent pillars based on their child pillars' scores
    tb40Result[group.parent].forEach((pillar) => {
      const childsPillarScore = tb40Result[group.child]
        .filter(
          (childPillar) =>
            childPillar.parents.filter(
              (parentPillar) =>
                parentPillar.group === group.parent &&
                parentPillar.no === pillar.pillar.no
            ).length
        )
        .map((childPillar) => childPillar.score);
      pillar.score = (
        childsPillarScore.reduce((acc, score) => acc + score * 1, 0) /
        childsPillarScore.length
      ).toFixed(2);
    });
  });

  // Sort the pillars based on their scores
  tb40Calc.groupLinage.forEach((group, index) => {
    tb40Result[group.parent] = tb40Result[group.parent].sort(
      (a, b) => b.score - a.score
    );
  });

  // Render the template with the calculation results
  const tb40Presentation = JSON.parse(
    renderTemplate(JSON.stringify(tb40Calc.presentation), {
      umum,
      tb40: tb40Result,
    })
  );

  // Return the calculation result
  return {
    message: `Calculation for ${type} in version ${version}`,
    data: umum, tb40Result, tb40Presentation,
  };
}

module.exports = {
  handleCalculation,
};
