import { loadReal } from "./extract.mjs";

class FakeLocalStorage {
  constructor() { this._data = {}; }
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._data, k) ? this._data[k] : null; }
  setItem(k, v) { this._data[k] = String(v); }
  removeItem(k) { delete this._data[k]; }
}

let pass = 0, fail = 0;
function assert(cond, msg) { if (cond) { pass++; } else { fail++; console.error("FAIL:", msg); } }

async function run() {
  const { ctx } = loadReal();
  // Simulate a real browser: `window` exists (self-referential, like the real global object),
  // but has no `.storage` property — that API only exists inside Claude.ai's Artifacts iframe.
  ctx.window = ctx;
  ctx.localStorage = new FakeLocalStorage();

  // --- In a real browser (no window.storage), saveState actually persists to localStorage ---
  assert(ctx.window.storage === undefined, "sanity check: simulated environment has no window.storage, like a real browser");
  const sample = { seq: 9, insts: { i1: { hab: 5, area: "TOWN" } }, houses: { H1: { b: "leaf-hut", area: "TOWN", cap: 1 } }, customTypes: {}, place: { Pikachu: { t: "h", i: "i1" } }, extra: {} };
  await ctx.saveState(sample);
  const raw = ctx.localStorage.getItem(ctx.V6);
  assert(raw !== null, "saveState actually wrote something to localStorage (this was the bug — it silently wrote nothing before the fix)");
  assert(JSON.parse(raw).seq === 9, "the persisted data matches what was saved");

  // --- loadState reads it back correctly — simulates a page refresh ---
  const loaded = await ctx.loadState();
  assert(JSON.stringify(loaded.insts) === JSON.stringify(sample.insts), "loadState round-trips insts after a simulated refresh");
  assert(JSON.stringify(loaded.houses) === JSON.stringify(sample.houses), "loadState round-trips houses after a simulated refresh");
  assert(JSON.stringify(loaded.place) === JSON.stringify(sample.place), "loadState round-trips place after a simulated refresh");
  assert(loaded.seq === 9, "loadState round-trips the seq counter after a simulated refresh");

  // --- With no saved data at all, loadState falls back to EMPTY rather than throwing ---
  ctx.localStorage.removeItem(ctx.V6);
  const empty = await ctx.loadState();
  assert(JSON.stringify(empty) === JSON.stringify(ctx.EMPTY), "loadState falls back to EMPTY when nothing has been saved yet");

  // --- If window.storage IS present (e.g. previewed inside a Claude Artifact), it's preferred, and localStorage is left untouched (no dual-write) ---
  const fakeClaudeStore = {};
  ctx.window.storage = {
    get: async (k) => (fakeClaudeStore[k] ? { value: fakeClaudeStore[k] } : null),
    set: async (k, v) => { fakeClaudeStore[k] = v; },
    delete: async (k) => { delete fakeClaudeStore[k]; },
  };
  const claudeSample = { seq: 42, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
  await ctx.saveState(claudeSample);
  assert(fakeClaudeStore[ctx.V6] !== undefined, "when window.storage is present, it's used as the primary store");
  assert(ctx.localStorage.getItem(ctx.V6) === null, "when window.storage is present, localStorage is not also written to");
  const loadedClaude = await ctx.loadState();
  assert(loadedClaude.seq === 42, "loadState reads from window.storage when it's present");
  delete ctx.window.storage;

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
run();
