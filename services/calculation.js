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
// const tb40Calc = calculationData.parts.tb40;

// const tb40Result = {};

// const exampleScores = [
//   60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90,
//   100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100, 60, 70,
//   80, 90, 100,
// ];
// exampleScores
// Map the results to the corresponding pillars based on the group
// Object.entries(tb40Calc.result).forEach(([key, value]) => {
//   tb40Result[key] = tb40Calc.pillars.filter(
//     (pillar) => pillar.pillar.group === key
//   );
// });
// tb40Result;

// for (let i = 0; i < tb40Calc.groupLinage.length; i++) {
//   const group = tb40Calc.groupLinage[i];
//   if (i === 0) {
//     for (let j = 0; j < tb40Result[group.child].length; j++) {
//       const pillar = tb40Result[group.child][j];
//       pillar.score = exampleScores[pillar.questionIndex - 1];
//     }
//   }

//   for (let j = 0; j < tb40Result[group.parent].length; j++) {
//     const pillar = tb40Result[group.parent][j];
//     pillar.score = tb40Result[group.child]
//       .filter(
//         (childPillar) =>
//           childPillar.parents.filter(
//             (parentPillar) =>
//               parentPillar.group === group.parent &&
//               parentPillar.no === pillar.pillar.no
//           ).length
//       )
//       .map((childPillar) => childPillar.score);
//     pillar.score =
//       (pillar.score.reduce((acc, score) => acc + score, 0) / pillar.score.length).toFixed(2);
//   }
// }
// tb40Result

// tb40Calc.groupLinage.forEach((group, index) => {
//   if (index === 0) {
//     tb40Result[group.child].forEach((pillar) => {
//       pillar.score = exampleScores[pillar.questionIndex-1];
//     });
//   }

//   tb40Result[group.parent].forEach((pillar) => {
//     pillar.score = tb40Result[group.child]
//       .filter(
//         (childPillar) =>
//           childPillar.parents.filter(
//             (parentPillar) =>
//               parentPillar.group === group.parent &&
//               parentPillar.no === pillar.pillar.no
//           ).length
//       )
//       .map((childPillar) => childPillar.score);
//     pillar.score =
//       (pillar.score.reduce((acc, score) => acc + score, 0) / pillar.score.length).toFixed(2);
//   });
// });

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
        childsPillarScore.reduce((acc, score) => acc + (score * 1), 0) /
        childsPillarScore.length
      ).toFixed(2);
    });
  });

  // Return the calculation result
  return {
    message: `Calculation for ${type} in version ${version}`,
    data: tb40Result,
  };
}

module.exports = {
  handleCalculation,
};
