"use strict";

const assert = require("node:assert/strict");
const data = require("../general-it/data.js");

const requireText = (record, field, label) => {
  assert.equal(typeof record[field], "string", `${label}.${field} must be text`);
  assert.ok(record[field].trim().length > 0, `${label}.${field} must not be blank`);
};

assert.equal(data.categories.length, 20, "Expected exactly 20 support domains");
assert.equal(data.issuePatterns.length, 10, "Expected exactly 10 issue families");
assert.equal(data.contexts.length, 5, "Expected exactly 5 operating contexts");
assert.equal(data.problems.length, 1000, "Expected exactly 1,000 troubleshooting records");
assert.equal(data.interviews.length, 100, "Expected exactly 100 interview Q&A records");

const uniqueCount = (records, field) => new Set(records.map((record) => record[field])).size;
assert.equal(uniqueCount(data.problems, "id"), 1000, "Troubleshooting IDs must be unique");
assert.equal(uniqueCount(data.problems, "title"), 1000, "Troubleshooting titles must be unique");
assert.equal(uniqueCount(data.interviews, "id"), 100, "Interview IDs must be unique");
assert.equal(uniqueCount(data.interviews, "question"), 100, "Interview questions must be unique");

for (const problem of data.problems) {
  const label = `problem ${problem.id}`;
  ["id", "title", "category", "categoryId", "context", "contextId", "patternId", "symptom", "verification", "escalation"].forEach((field) => requireText(problem, field, label));
  assert.ok(Array.isArray(problem.likelyCauses) && problem.likelyCauses.length >= 3, `${label} needs at least three likely causes`);
  assert.ok(Array.isArray(problem.fixSteps) && problem.fixSteps.length === 5, `${label} needs exactly five safe fix steps`);
  assert.ok(Array.isArray(problem.tools) && problem.tools.length >= 3, `${label} needs at least three evidence tools`);
  assert.ok(Array.isArray(problem.tags) && problem.tags.length >= 3, `${label} needs searchable tags`);
}

for (const interview of data.interviews) {
  const label = `interview ${interview.id}`;
  ["id", "category", "categoryId", "topic", "question", "answer", "answerShape"].forEach((field) => requireText(interview, field, label));
  assert.ok(interview.answer.length >= 180, `${label} answer is too shallow`);
}

const serialized = JSON.stringify({ problems: data.problems, interviews: data.interviews }).toLowerCase();
[
  "never disable mfa",
  "never borrow another user's account",
  "do not execute suspicious content to test it",
  "request a narrow reviewed exception only after validating business need and risk"
].forEach((safetyMarker) => assert.ok(serialized.includes(safetyMarker), `Required safety marker missing: ${safetyMarker}`));

console.log("General IT coverage check passed: 20 domains, 1,000 troubleshooting records, and 100 interview Q&A records.");
