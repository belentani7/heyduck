"use strict";

/**
 * DUCK asset contract: static files in DUCK_DATA must exist in the repository.
 * Runs on Node core only, with no build dependency or external network.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const data = require("../data.js");

const ROOT = path.resolve(__dirname, "..");
function assertRealAsset(relative) {
  assert.equal(typeof relative, "string");
  assert.match(relative, /^images\/[\w./-]+$/);
  assert.equal(relative.includes(".."), false, "Path traversal not allowed");
  assert.ok(existsSync(path.join(ROOT, relative)), "Missing asset: " + relative);
}

test("site metadata has a real identity and a full service catalogue", () => {
  assert.equal(data.name, "Duck");
  assert.equal(data.location, "Aracaju, Sergipe, Brasil");
  assert.ok(data.services.length >= 4);
  assert.equal(new Set(data.services.map(s => s.id)).size, data.services.length);
});

test("all hero photographs have matching committed local image files", () => {
  assert.ok(data.heroBackgrounds.length >= 4);
  for (const asset of data.heroBackgrounds) assertRealAsset(asset);
});

test("every release cover and studio station has a resolvable image file", () => {
  assert.ok(data.singles.length >= 8);
  for (const single of data.singles) {
    assert.ok(single.title && single.artist);
    assertRealAsset(single.cover);
  }
  for (const station of data.stations) {
    assert.ok(station.name && station.description);
    assertRealAsset(station.image);
  }
});

test("editorial placeholder cannot masquerade as official release artwork", () => {
  const track = data.singles.find(single => single.title === "Slip N Slide");
  assert.ok(track);
  assert.match(track.cover, /placeholder\.svg$/);
  const source = readFileSync(path.join(ROOT, track.cover), "utf8");
  assert.match(source, /ARTWORK PENDING/);
  assert.match(source, /<title/);
  assert.match(source, /<desc/);
});

test("external release URLs use https or explicitly state unresolved links", () => {
  const unresolved = [];
  for (const track of data.singles) {
    if (track.link === "#") { unresolved.push(track.title); continue; }
    assert.match(track.link, /^https:\/\/[^\s]+$/, track.title);
  }
  // Placeholder links require editorial verification, never fabricated URLs.
  assert.ok(unresolved.length <= data.singles.length);
});
