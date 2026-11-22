import { describe, expect, it } from "vitest";
import { detectBranchRelations } from "./branch-relations.js";

describe("Earthly Branch relationship detection", () => {
  it("detects all six harmony pairs", () => {
    const pairs = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
    for (const pair of pairs) {
      expect(detectBranchRelations(pair).some(match => match.kind === "six_harmony")).toBe(true);
    }
  });

  it("detects a complete three-harmony and its half-harmony pairs", () => {
    const full = detectBranchRelations([8,0,4]);
    expect(full.some(match => match.kind === "three_harmony" && match.label === "申子辰水局")).toBe(true);
    expect(full.filter(match => match.kind === "half_harmony")).toHaveLength(3);
  });

  it("detects three meetings, clashes, harms, breaks and punishments independently", () => {
    expect(detectBranchRelations([2,3,4]).some(match => match.kind === "three_meeting")).toBe(true);
    expect(detectBranchRelations([0,6]).some(match => match.kind === "six_clash")).toBe(true);
    expect(detectBranchRelations([0,7]).some(match => match.kind === "harm")).toBe(true);
    expect(detectBranchRelations([0,9]).some(match => match.kind === "break")).toBe(true);
    expect(detectBranchRelations([2,5,8]).some(match => match.kind === "punishment" && match.label === "寅巳申三刑")).toBe(true);
  });

  it("detects self-punishment from repeated chart positions", () => {
    expect(detectBranchRelations([4,4]).some(match => match.kind === "punishment" && match.label === "辰辰自刑")).toBe(true);
  });

  it("returns no matches for invalid input and preserves source positions", () => {
    expect(detectBranchRelations([0,12])).toEqual([]);
    const result = detectBranchRelations([6,0]);
    expect(result.find(match => match.kind === "six_clash")?.positions).toEqual([0,1]);
  });
});
