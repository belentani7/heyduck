import { describe, expect, it } from "vitest";
import { buildPreviewNotes, getPreviewDurationSeconds } from "./beatLabSequence";

describe("sequência de prévia do Beat Lab", () => {
  it("cria uma sequência curta e determinística para cada clima", () => {
    const notes = buildPreviewNotes("Noturno");

    expect(notes).toHaveLength(8);
    expect(notes).toEqual([45, 52, 48, 55, 57, 52, 48, 45]);
    expect(buildPreviewNotes("Luminoso")).not.toEqual(notes);
  });

  it("calcula a duração a partir de BPM e número de passos", () => {
    expect(getPreviewDurationSeconds(8, 120)).toBe(4);
    expect(getPreviewDurationSeconds(8, 60)).toBe(8);
  });
});
