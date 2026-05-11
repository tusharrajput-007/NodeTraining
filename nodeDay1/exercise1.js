// 1. Build an occasion sign
function buildSign(occasion, name) {
  return `Happy ${occasion} ${name}!`;
}

// 2. Build a birthday sign
function buildBirthdaySign(age) {
  const word = age >= 50 ? "mature" : "young";
  return `Happy Birthday! What a ${word} fellow you are.`;
}

// 3. Build a graduation sign
function graduationFor(name, year) {
  return `Congratulations ${name}!\nClass of ${year}`;
}

// 4. Compute the cost of a sign
function costOf(sign, currency) {
  // const total = 20 + sign.length * 2;
  return `Your sign costs ${(20 + sign.length * 2).toFixed(2)} ${currency}.`;
}
``;

// console.log(buildSign("Birthday", "Rob"));
// console.log(buildBirthdaySign(45));
// console.log(buildBirthdaySign(55));
// console.log(graduationFor("Hannah", 2022));
console.log(costOf("Happy Birthday Rob!", "dollars"));
