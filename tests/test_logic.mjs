import { loadReal } from "./extract.mjs";

const { ctx, mutations } = loadReal();
const { v5ToV6, HOUSE_BY, houseMismatchInfo, findBetterHouse } = ctx;
const { addHouseBuilding, addCustomHouse, removeHouseBuilding, assignToHouse, unassignHouse, buildHouseForGroup } = mutations;

let pass = 0, fail = 0;
function assert(cond, msg) { if (cond) { pass++; } else { fail++; console.error("FAIL:", msg); } }

// --- v5->v6 migration is lossless ---
const v5 = { seq: 5, insts: { i1: { hab: 22, area: "TOWN" } }, place: { Pikachu: { t: "h", i: "i1" }, Eevee: { t: "house", a: "TOWN" } }, extra: { Mew: true } };
const v6 = v5ToV6(v5);
assert(JSON.stringify(v6.insts) === JSON.stringify(v5.insts), "migration preserves insts");
assert(JSON.stringify(v6.place) === JSON.stringify(v5.place), "migration preserves place (legacy unassigned house entries stay valid)");
assert(JSON.stringify(v6.extra) === JSON.stringify(v5.extra), "migration preserves extra");
assert(JSON.stringify(v6.houses) === "{}", "migration adds empty houses map");
assert(JSON.stringify(v6.customTypes) === "{}", "migration adds empty customTypes map");
assert(v6.seq === 5, "migration preserves seq counter");

// --- capacity is enforced ---
let s = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
s = addHouseBuilding("leaf-hut", "TOWN", s);
const houseId = Object.keys(s.houses)[0];
s = assignToHouse("Pikachu", houseId, s);
assert(s.place.Pikachu.h === houseId, "first resident assigned ok");
s = assignToHouse("Eevee", houseId, s);
assert(s.place.Eevee === undefined, "second resident rejected when house is full (cap 1, from real HOUSE_BY data)");
s = assignToHouse("Pikachu", houseId, s);
assert(s.place.Pikachu.h === houseId, "re-assigning the same occupant to the same house still works");

let s2 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
s2 = addHouseBuilding("leaf-cottage", "TOWN", s2);
const h2 = Object.keys(s2.houses)[0];
s2 = assignToHouse("A", h2, s2);
s2 = assignToHouse("B", h2, s2);
assert(s2.place.A.h === h2 && s2.place.B.h === h2, "cap-2 house accepts 2 residents (real leaf-cottage cap)");
s2 = assignToHouse("C", h2, s2);
assert(s2.place.C === undefined, "cap-2 house rejects a 3rd resident");

// --- removeHouseBuilding relocates occupants rather than dropping them ---
let s3 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
s3 = addHouseBuilding("leaf-cottage", "BEACH", s3);
const h3 = Object.keys(s3.houses)[0];
s3 = assignToHouse("Squirtle", h3, s3);
s3 = assignToHouse("Wartortle", h3, s3);
s3 = removeHouseBuilding(h3, s3);
assert(s3.houses[h3] === undefined, "house removed from houses map");
assert(s3.place.Squirtle.t === "house" && s3.place.Squirtle.a === "BEACH" && !s3.place.Squirtle.h, "occupant relocated to unassigned, not dropped");
assert(s3.place.Wartortle.t === "house" && s3.place.Wartortle.a === "BEACH" && !s3.place.Wartortle.h, "second occupant relocated too");

// --- unassignHouse moves a single resident back to unassigned ---
let s4 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
s4 = addHouseBuilding("leaf-cottage", "RIDGE", s4);
const h4 = Object.keys(s4.houses)[0];
s4 = assignToHouse("Onix", h4, s4);
s4 = unassignHouse("Onix", s4);
assert(s4.place.Onix.t === "house" && s4.place.Onix.a === "RIDGE" && !s4.place.Onix.h, "unassignHouse moves resident back to area-unassigned");
assert(s4.houses[h4] !== undefined, "house itself is untouched by unassignHouse");

// --- buildHouseForGroup fills to capacity, leaving overflow unassigned ---
let s5 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: { A: { t: "house", a: "TOWN" }, B: { t: "house", a: "TOWN" }, C: { t: "house", a: "TOWN" } }, extra: {} };
s5 = buildHouseForGroup("leaf-cottage", ["A", "B", "C"], "TOWN", s5);
const gid = Object.keys(s5.houses)[0];
assert(s5.houses[gid].cap === 2, "group house built with correct real capacity");
assert(s5.place.A.h === gid && s5.place.B.h === gid, "first two group members assigned into the house");
assert(s5.place.C.t === "house" && s5.place.C.a === "TOWN" && !s5.place.C.h, "overflow member stays unassigned rather than being dropped or double-booked");

let s6 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: { W: { t: "house", a: "BEACH" }, X: { t: "house", a: "BEACH" }, Y: { t: "house", a: "BEACH" }, Z: { t: "house", a: "BEACH" } }, extra: {} };
s6 = buildHouseForGroup("leaf-house", ["W", "X", "Y", "Z"], "BEACH", s6);
const gid2 = Object.keys(s6.houses)[0];
assert(["W", "X", "Y", "Z"].every(m => s6.place[m].h === gid2), "cap-4 house (real leaf-house capacity) absorbs a full group of 4");

let s7 = { seq: 1, insts: {}, houses: { H0: { b: "leaf-hut", area: "RIDGE", cap: 1 } }, customTypes: {}, place: { P: { t: "house", h: "H0" }, Q: { t: "house", a: "RIDGE" } }, extra: {} };
s7 = buildHouseForGroup("leaf-cottage", ["P", "Q"], "RIDGE", s7);
const gid3 = Object.keys(s7.houses).find(k => k !== "H0");
assert(s7.place.P.h === "H0", "already-housed mon is untouched by an unrelated group action");
assert(s7.place.Q.h === gid3, "still-unassigned group member gets placed into the new house");

// --- buildHouseForGroup can pull a Pokémon OUT of a habitat, freeing the slot ---
let s8 = { seq: 1, insts: { i1: { hab: 5, area: "TOWN" } }, houses: {}, customTypes: {}, place: { Bulbasaur: { t: "h", i: "i1" }, Ivysaur: { t: "house", a: "TOWN" } }, extra: {} };
s8 = buildHouseForGroup("leaf-cottage", ["Bulbasaur", "Ivysaur"], "TOWN", s8);
const gid4 = Object.keys(s8.houses)[0];
assert(s8.place.Bulbasaur.t === "house" && s8.place.Bulbasaur.h === gid4, "habitat-dwelling group member moved into the new house");
assert(s8.place.Ivysaur.h === gid4, "unassigned group member also moved in");
assert(s8.insts.i1 !== undefined, "vacating a habitat via group housing does not delete the built habitat instance");

// --- custom house types ---
let s9 = { seq: 1, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
s9 = addCustomHouse("Beach bungalow", 3, "BEACH", s9);
const ctKey = Object.keys(s9.customTypes)[0];
assert(s9.customTypes[ctKey].n === "Beach bungalow" && s9.customTypes[ctKey].cap === 3, "custom type registered with given name/capacity");
const custHouseId = Object.keys(s9.houses)[0];
assert(s9.houses[custHouseId].b === ctKey && s9.houses[custHouseId].cap === 3, "first custom house instance created with matching capacity");
s9 = addHouseBuilding(ctKey, "BEACH", s9);
assert(Object.keys(s9.houses).length === 2, "custom type can be reused to build a second instance");
const secondCustom = Object.keys(s9.houses).find(k => k !== custHouseId);
assert(s9.houses[secondCustom].cap === 3, "reused custom type carries its capacity forward correctly");
s9 = assignToHouse("M1", custHouseId, s9);
s9 = assignToHouse("M2", custHouseId, s9);
s9 = assignToHouse("M3", custHouseId, s9);
s9 = assignToHouse("M4", custHouseId, s9);
assert(s9.place.M1.h === custHouseId && s9.place.M2.h === custHouseId && s9.place.M3.h === custHouseId, "custom cap-3 house accepts 3 residents");
assert(s9.place.M4 === undefined, "custom cap-3 house rejects a 4th resident");

// --- id-generation contract the UI's "jump to selection" feature depends on ---
let s16 = { seq: 7, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
const predictedId16 = "H" + s16.seq;
s16 = addHouseBuilding("leaf-hut", "TOWN", s16);
assert(Object.keys(s16.houses)[0] === predictedId16, "addHouseBuilding's actual id matches what the UI predicts from the pre-call seq");
assert(s16.seq === 8, "addHouseBuilding increments seq by exactly 1");

let s17 = { seq: 7, insts: {}, houses: {}, customTypes: {}, place: {}, extra: {} };
const predictedId17 = "H" + (s17.seq + 1);
s17 = addCustomHouse("Test bungalow", 2, "TOWN", s17);
assert(Object.keys(s17.houses)[0] === predictedId17, "addCustomHouse's actual id matches what the UI predicts from the pre-call seq+1");
assert(s17.seq === 9, "addCustomHouse increments seq by exactly 2");

// --- houseMismatchInfo: harmonious households ---
assert(houseMismatchInfo(["Pikachu"]).mixed === false, "a single resident is never mixed");
assert(houseMismatchInfo(["Pikachu", "Bulbasaur", "Ivysaur"]).mixed === false, "all-same-habitat household is harmonious (real data: all Bright)");
assert(houseMismatchInfo(["Pikachu", "Bulbasaur", "Ivysaur"]).mismatched.size === 0, "harmonious household flags nobody");

// --- houseMismatchInfo: clear majority flags only the minority ---
let info9 = houseMismatchInfo(["Pikachu", "Bulbasaur", "Eevee"]); // real data: 2 Bright, 1 Warm
assert(info9.mixed === true, "2-vs-1 split is detected as mixed");
assert(info9.majority === "Bright", "majority category correctly identified from real data");
assert(info9.mismatched.size === 1 && info9.mismatched.has("Eevee"), "only the minority resident is flagged, not the majority pair");

// --- houseMismatchInfo: a tie flags everyone (no confident majority) ---
let info10 = houseMismatchInfo(["Pikachu", "Eevee"]); // real data: 1 Bright, 1 Warm — tie
assert(info10.mixed === true, "a 1-1 tie is still mixed");
assert(info10.majority === null, "a tie has no single majority");
assert(info10.mismatched.size === 2, "with no majority, both residents are flagged for the user to reconsider");

// --- houseMismatchInfo ignores mons with no mapped Ideal Habitat ---
let info11 = houseMismatchInfo(["Pikachu", "Bulbasaur", "Totally Unmapped Mon"]);
assert(info11.mixed === false, "an unmapped resident doesn't count toward or against harmony");

// --- findBetterHouse: prefers an existing non-empty matching house over an empty one ---
let houses12 = { cur: { b: "leaf-cottage", area: "TOWN", cap: 2 }, matchHouse: { b: "leaf-cottage", area: "TOWN", cap: 2 }, emptyHouse: { b: "leaf-hut", area: "TOWN", cap: 1 } };
let occByHouse12 = { cur: ["Eevee", "Pikachu"], matchHouse: ["Charmander"], emptyHouse: [] }; // Eevee/Charmander both Warm (real data)
const best12 = findBetterHouse("Eevee", "cur", "TOWN", houses12, occByHouse12);
assert(best12 === "matchHouse", "prefers a non-empty house whose residents already share the mon's real Ideal Habitat over an empty one");

// --- findBetterHouse: falls back to an empty house if no populated match exists ---
let houses13 = { cur: { b: "leaf-cottage", area: "TOWN", cap: 2 }, emptyHouse: { b: "leaf-hut", area: "TOWN", cap: 1 } };
let occByHouse13 = { cur: ["Eevee", "Pikachu"], emptyHouse: [] };
const best13 = findBetterHouse("Eevee", "cur", "TOWN", houses13, occByHouse13);
assert(best13 === "emptyHouse", "falls back to an empty house when no populated match is available");

// --- findBetterHouse: returns null when nothing fits ---
let houses14 = { cur: { b: "leaf-cottage", area: "TOWN", cap: 2 }, full: { b: "leaf-hut", area: "TOWN", cap: 1 }, otherArea: { b: "leaf-hut", area: "BEACH", cap: 1 } };
let occByHouse14 = { cur: ["Eevee", "Pikachu"], full: ["Charmander"], otherArea: [] };
const best14 = findBetterHouse("Eevee", "cur", "TOWN", houses14, occByHouse14);
assert(best14 === null, "returns null when every other option is full or in a different area");

// --- findBetterHouse: never suggests the mon's own current house ---
let houses15 = { cur: { b: "leaf-cottage", area: "TOWN", cap: 4 } };
let occByHouse15 = { cur: ["Eevee"] };
const best15 = findBetterHouse("Eevee", "cur", "TOWN", houses15, occByHouse15);
assert(best15 === null, "the mon's current house is excluded from its own candidate list even if it has room");

// --- sanity check on the underlying data itself, since several tests above lean on it ---
assert(HOUSE_BY["leaf-hut"].cap === 1, "real HOUSE_BY: leaf-hut cap is 1");
assert(HOUSE_BY["leaf-cottage"].cap === 2, "real HOUSE_BY: leaf-cottage cap is 2");
assert(HOUSE_BY["leaf-house"].cap === 4, "real HOUSE_BY: leaf-house cap is 4");
assert(Object.keys(ctx.IDEAL_HABITAT).length === 308, "real IDEAL_HABITAT has the expected 308 mapped species");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
