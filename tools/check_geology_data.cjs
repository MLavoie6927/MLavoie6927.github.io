"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "geology", "geology-data.js");
const source = fs.readFileSync(sourcePath, "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: sourcePath });

const data = context.window.GEOLOGY_DATA;
const failures = [];

function requireCondition(condition, message) {
  if (!condition) failures.push(message);
}

requireCondition(data && typeof data === "object", "geology data object is missing");
requireCondition(Array.isArray(data.domains), "domains must be an array");
requireCondition(Array.isArray(data.settings), "settings must be an array");

if (data && Array.isArray(data.domains)) {
  requireCondition(data.domains.length === 20, `expected 20 domains, found ${data.domains.length}`);
  const ids = new Set();
  let subtopicCount = 0;
  let investigationCount = 0;

  data.domains.forEach((domain, index) => {
    const label = `domain ${index + 1}`;
    requireCondition(typeof domain.id === "string" && domain.id.length > 2, `${label}: missing id`);
    requireCondition(!ids.has(domain.id), `${label}: duplicate id ${domain.id}`);
    ids.add(domain.id);
    requireCondition(typeof domain.group === "string" && domain.group.trim().length > 3, `${label}: group is missing`);
    requireCondition(typeof domain.title === "string" && domain.title.trim().length > 8, `${label}: title is too short or missing`);
    ["summary", "question", "example"].forEach((field) => {
      requireCondition(typeof domain[field] === "string" && domain[field].trim().length > 20, `${label}: ${field} is too short or missing`);
    });
    ["evidence", "tools", "decisions"].forEach((field) => {
      requireCondition(Array.isArray(domain[field]) && domain[field].length >= 2, `${label}: ${field} needs at least two entries`);
    });
    requireCondition(Array.isArray(domain.subtopics) && domain.subtopics.length === 5, `${label}: expected five subtopics`);
    (domain.subtopics || []).forEach((subtopic, subIndex) => {
      ["name", "concept", "ask", "data"].forEach((field) => {
        requireCondition(typeof subtopic[field] === "string" && subtopic[field].trim().length > 10, `${label} subtopic ${subIndex + 1}: ${field} is too short or missing`);
      });
    });
    subtopicCount += (domain.subtopics || []).length;

    const investigation = domain.investigation;
    requireCondition(investigation && typeof investigation === "object", `${label}: investigation is missing`);
    if (investigation) {
      investigationCount += 1;
      ["scenario", "question", "decision"].forEach((field) => {
        requireCondition(typeof investigation[field] === "string" && investigation[field].trim().length > 25, `${label} investigation: ${field} is too short or missing`);
      });
      ["collect", "analyze"].forEach((field) => {
        requireCondition(Array.isArray(investigation[field]) && investigation[field].length === 3, `${label} investigation: ${field} must have three steps`);
      });
    }
  });

  requireCondition(subtopicCount === 100, `expected 100 subtopics, found ${subtopicCount}`);
  requireCondition(investigationCount === 20, `expected 20 investigations, found ${investigationCount}`);
}

if (data && Array.isArray(data.settings)) {
  requireCondition(data.settings.length === 6, `expected six tectonic settings, found ${data.settings.length}`);
  const settingIds = new Set();
  data.settings.forEach((setting, index) => {
    requireCondition(typeof setting.id === "string" && !settingIds.has(setting.id), `setting ${index + 1}: missing or duplicate id`);
    settingIds.add(setting.id);
    ["label", "className", "title", "process", "landforms", "hazards", "evidence"].forEach((field) => {
      requireCondition(typeof setting[field] === "string" && setting[field].trim().length > 4, `setting ${index + 1}: ${field} is missing`);
    });
    requireCondition(Array.isArray(setting.diagram) && setting.diagram.length >= 4, `setting ${index + 1}: diagram parts are incomplete`);
  });
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL: ${failure}`));
  process.exit(1);
}

console.log("PASS: Geology Field Guide contains 20 domains, 100 subtopics, 20 investigations, and 6 tectonic settings");
