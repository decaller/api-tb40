var fs = require("fs");
var path = require("path");
var renderTemplate = require("../utils/templateRenderer");
var { scoreToColor, rankToColor } = require("../utils/coloring");

// Load the calculation JSON data
const calculationData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../api/v0.1/tb40/calculation.json"),
    "utf8",
  ),
);

function handleCalculation(req) {
  const { version, type } = req.params;
  const { parts } = req.body;
  const { umum, tb40 } = parts;

  // Load the calculation data for tb40
  const tb40Calc = calculationData.parts.tb40;
  let tb40Result = {};

  // Map the results to the corresponding pillars based on the group
  Object.entries(tb40Calc.result).forEach(([key, value]) => {
    tb40Result[key] = tb40Calc.pillars.filter(
      (pillar) => pillar.pillar.group === key,
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
                parentPillar.no === pillar.pillar.no,
            ).length,
        )
        .map((childPillar) => childPillar.score);
      pillar.score = (
        childsPillarScore.reduce((acc, score) => acc + score * 1, 0) /
        childsPillarScore.length
      ).toFixed(2);
      pillar.color = scoreToColor(pillar.score); // Calculate the color based on the score
    });
  });

  // Sort 40 based by number for svg parsing
  tb40Result["40"].sort((a, b) => a.pillar.no - b.pillar.no);

  // Sort the pillars based on their scores
  let tb40ResultRanked = {};
  Object.entries(tb40Result).forEach(([key, value]) => {
    tb40ResultRanked[key] = tb40Result[key].sort((a, b) => b.score - a.score);
  });

  // Calculate the color based on the rank
  Object.entries(tb40Result).forEach(([key, value]) => {
    tb40ResultRanked[key].forEach((pillar, index) => {
      pillar.rank = index + 1;
      pillar.rankColor = rankToColor(pillar.rank, tb40Result[key].length);
    });
  });

  // Inject file to presentation
  Object.entries(tb40Calc.presentation).forEach(([key, value]) => {
    console.log(value);
    if (value.file) {
      value.file = fs.readFileSync(
        path.join(__dirname, `../api/v0.1/tb40/${value.file}`),
        "utf8",
      );
    }
  });

  // Render the template with the calculation results
  const tb40Presentation = JSON.parse(
    renderTemplate(JSON.stringify(tb40Calc.presentation), {
      umum,
      tb40: { result: tb40Result, ranked: tb40ResultRanked },
    }),
  );

  // Return the calculation result
  return {
    message: `Calculation for ${type} in version ${version}`,
    parts: {
      umum,
      tb40: {
        tb40Result,
        tb40ResultRanked,
        tb40Presentation,
      },
    },
  };
}

module.exports = {
  handleCalculation,
};
