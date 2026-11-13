const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function controller() {
  const hits = [];
  const engine = { audioContext: { currentTime: 0 }, resume() {}, playInstrument: name => hits.push(name) };
  const element = { textContent: '', classList: { add() {}, remove() {} } };
  const document = { addEventListener() {}, getElementById: () => element, querySelectorAll: () => [], querySelector: () => element };
  const sandbox = { audioEngine: engine, document, window: {}, console: { log() {} }, requestAnimationFrame: () => 1, cancelAnimationFrame() {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8'), sandbox);
  const app = vm.runInContext('new DuckController()', sandbox);
  app.state.tracks.kick.active = [0, 1];
  return { app, engine, hits };
}

test('each sequencer step sounds once across multiple display frames', () => {
  const { app, engine, hits } = controller();
  app.startPlayback();
  for (const time of [0.01, 0.03, 0.06, 0.1]) {
    engine.audioContext.currentTime = time;
    app.scheduleSequence();
  }
  assert.equal(hits.length, 1);
  engine.audioContext.currentTime = 0.13;
  app.scheduleSequence();
  assert.equal(hits.length, 2);
});

test('the first step plays again when playback restarts', () => {
  const { app, hits } = controller();
  app.startPlayback(); app.stopPlayback(); app.startPlayback();
  assert.equal(hits.length, 2);
});
