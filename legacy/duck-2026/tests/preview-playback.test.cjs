const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup() {
  class Element {
    constructor() {
      this.children = []; this.events = {}; this.dataset = {}; this.attributes = {};
      this.style = { setProperty() {} };
      this.classList = { add() {}, remove() {}, toggle() {} };
    }
    querySelector() { return new Element(); }
    setAttribute(name, value) { this.attributes[name] = value; }
    appendChild(child) { this.children.push(child); }
    addEventListener(name, fn) { this.events[name] = fn; }
  }
  const nodes = new Map();
  const document = {
    querySelector(id) { if (!nodes.has(id)) nodes.set(id, new Element()); return nodes.get(id); },
    createElement() { return new Element(); }, body: new Element(), addEventListener() {}
  };
  const audios = [];
  class Audio {
    constructor(src) { this.src = src; this.paused = true; this.events = {}; audios.push(this); }
    play() { return new Promise((resolve, reject) => { this.resolve = () => { this.paused = false; resolve(); }; this.reject = reject; }); }
    pause() { this.paused = true; }
    addEventListener(name, fn) { this.events[name] = fn; }
  }
  let timerId = 0;
  const timers = new Map();
  const data = {
    singles: [1, 2].map(id => ({ id, title: `Track ${id}`, artist: 'DUCK', preview: `https://example.com/${id}.mp3` })),
    stats: {}, beatStore: [], services: [], stations: [], gear: {}, testimonials: []
  };
  const window = { DUCK_DATA: data, matchMedia: () => ({ matches: false }), addEventListener() {},
    setTimeout(fn, ms) { timers.set(++timerId, { fn, ms }); return timerId; }, clearTimeout(id) { timers.delete(id); } };
  vm.runInNewContext(readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8'), { window, DUCK_DATA: data, document, Audio, Map, Number });
  const cards = nodes.get('#releaseStack').children;
  const start = index => cards[index].events.pointerdown({ pointerType: 'mouse' });
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
  return { cards, audios, timers, nodes, start, settle };
}

test('a rejected old preview does not stop the newly selected track', async () => {
  const s = setup(); s.start(0); s.start(1);
  s.audios[1].resolve(); await s.settle();
  s.audios[0].reject(new Error('interrupted')); await s.settle();
  assert.equal(s.audios[1].paused, false);
  assert.equal(s.audios[1].src, 'https://example.com/2.mp3');
  assert.match(s.nodes.get('#previewStatus').textContent, /Track 2/);
});

test('a late play resolution does not create another timer or unmute an old track', async () => {
  const s = setup(); s.start(0); s.start(1);
  s.audios[1].resolve(); await s.settle();
  s.audios[0].resolve(); await s.settle();
  assert.equal(s.audios[0].paused, true);
  assert.equal(s.audios[0].volume, 0);
  assert.equal([...s.timers.values()].filter(t => t.ms === 24000).length, 1);
});

test('the selected preview exposes pressed state and resets on stop', async () => {
  const s = setup(); s.start(0); s.audios[0].resolve(); await s.settle();
  assert.equal(s.cards[0].attributes['aria-pressed'], 'true');
  s.cards[0].events.keydown({ key: 'Enter', preventDefault() {} });
  assert.equal(s.cards[0].attributes['aria-pressed'], 'false');
});

test('an ended event from an old track does not stop the current preview', async () => {
  const s = setup(); s.start(0); s.audios[0].resolve(); await s.settle();
  s.start(1); s.audios[1].resolve(); await s.settle();
  s.audios[0].events.ended();
  assert.equal(s.audios[1].paused, false);
});
