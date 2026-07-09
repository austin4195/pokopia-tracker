// Pulls the actual logic out of PokopiaTracker.jsx and makes it callable from Node,
// so tests exercise the real shipped source instead of a hand-copied duplicate that
// could silently drift out of sync with it.
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_PATH = path.join(__dirname, "..", "PokopiaTracker.jsx");

function extractBalanced(src, startIdx) {
  // startIdx must point at the opening brace/paren character.
  const open = src[startIdx];
  const close = open === "{" ? "}" : open === "(" ? ")" : null;
  if (!close) throw new Error(`extractBalanced: unsupported opener "${open}"`);
  let depth = 0;
  let inStr = null; // ', ", or ` while inside a string/template literal
  for (let i = startIdx; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];
    if (inStr) {
      if (c === inStr && prev !== "\\") inStr = null;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
  }
  throw new Error("extractBalanced: never closed");
}

/**
 * Loads PokopiaTracker.jsx and returns:
 *  - ctx: a vm context with every pure top-level const/function (HOUSE_BY, IDEAL_HABITAT,
 *    houseMismatchInfo, findBetterHouse, v5ToV6, EMPTY, VERSION, etc.) already evaluated
 *    from the real file, so tests can reference them directly.
 *  - mutations: an object of {name: fn(...args, state) => newState} rebuilt by extracting
 *    each `const NAME=(...args)=> setSt(s=>{...})` reducer verbatim from the real source
 *    and wrapping it as a standalone pure function callable outside of React.
 */
export function loadReal() {
  const src = fs.readFileSync(SOURCE_PATH, "utf8");

  // 1. The whole file up to the component definition is plain top-level JS (constants +
  //    pure functions, no JSX) — eval it directly so we get the real HOUSE_BY, IDEAL_HABITAT,
  //    houseMismatchInfo, findBetterHouse, v5ToV6, EMPTY, migration helpers, etc.
  const compIdx = src.indexOf("export default function PokopiaTracker");
  if (compIdx === -1) throw new Error("Could not find component boundary in source");
  const prefix = src.slice(0, compIdx).replace(/^import[\s\S]*?;\s*$/gm, "");
  // vm quirk: top-level `const`/`let` in a vm-run script stay in that script's lexical scope
  // and do NOT become properties of the sandbox object (only `var`/function declarations do).
  // Since the mutation wrappers below run as SEPARATE script executions in the same context,
  // they'd otherwise throw "HOUSE_BY is not defined" etc. Explicitly re-attach everything
  // the mutations reference onto globalThis (== the sandbox in vm) so it's visible everywhere.
  const exposeNames = [
    "HOUSE_TYPES", "HOUSE_BY", "IDEAL_HABITAT", "IDEAL_HABITAT_META",
    "houseMismatchInfo", "findBetterHouse", "v5ToV6", "EMPTY", "VERSION",
    "hasClaudeStorage", "getKey", "loadState", "saveState",
    "V6", "V5", "V4", "V3", "V2", "V1",
  ];
  const epilogue = `\nObject.assign(globalThis, {${exposeNames.join(",")}});\n`;

  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(prefix + epilogue, ctx, { filename: "PokopiaTracker.jsx (prefix)" });

  // 2. Extract each `const NAME=(args)=> setSt(s=>{...})` or `setSt(s=>({...}))` mutation
  //    reducer from the FULL source (they live inside the component body) and rebuild it
  //    as a standalone `(args..., s) => newState` function evaluated in the same context,
  //    so it can see HOUSE_BY/IDEAL_HABITAT/etc. exactly like the real app does.
  const mutationNames = [
    "addInstance", "removeInstance", "setOccupant", "clearOccupant", "addHouse",
    "addHouseBuilding", "addCustomHouse", "removeHouseBuilding", "assignToHouse",
    "unassignHouse", "buildHouseForGroup", "moveToInstance", "buildAndOccupy",
    "unplace", "toggleExtra",
  ];

  const mutations = {};
  for (const name of mutationNames) {
    const declRe = new RegExp(`const ${name}=\\(([^)]*)\\)=>\\s*setSt\\(s=>`, "m");
    const m = declRe.exec(src);
    if (!m) throw new Error(`Could not find mutation "${name}" in source (function signature may have changed)`);
    const argList = m[1]; // e.g. "buildingKey,areaKey"
    const bodyStart = m.index + m[0].length; // points at the char right after "setSt(s=>"
    const opener = src[bodyStart];
    let fnSrc;
    if (opener === "{") {
      // block body: setSt(s=>{ ...; return X; })
      const block = extractBalanced(src, bodyStart);
      fnSrc = `(function(${argList}${argList ? "," : ""}s){${block.slice(1, -1)}})`;
    } else if (opener === "(") {
      // expression body: setSt(s=>({...}))  — extractBalanced grabs the ( ... ) including parens
      const parenExpr = extractBalanced(src, bodyStart);
      fnSrc = `(function(${argList}${argList ? "," : ""}s){ return ${parenExpr}; })`;
    } else {
      throw new Error(`Mutation "${name}": unexpected reducer body starting with "${opener}"`);
    }
    mutations[name] = vm.runInContext(fnSrc, ctx, { filename: `PokopiaTracker.jsx (${name})` });
  }

  return { ctx, mutations };
}
