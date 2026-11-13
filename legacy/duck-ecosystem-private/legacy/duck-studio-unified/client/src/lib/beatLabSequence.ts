export type BeatLabMood = "Noturno" | "Denso" | "Luminoso" | "Íntimo" | "Cinemático";

const rootByMood: Record<BeatLabMood, number> = {
  Noturno: 45,
  Denso: 38,
  Luminoso: 48,
  Íntimo: 50,
  Cinemático: 41,
};

const intervals = [0, 7, 3, 10, 12, 7, 3, 0];

export function buildPreviewNotes(mood: BeatLabMood): number[] {
  const root = rootByMood[mood];
  return intervals.map(interval => root + interval);
}

export function getPreviewDurationSeconds(noteCount: number, bpm: number): number {
  return noteCount * (60 / bpm);
}
