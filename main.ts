// One Sentence for a Traveler from 1800
// Writes a single sentence (at most 200 characters, every word in use
// before 1800) explaining the modern internet to /output/entry.txt.
//
// Word audit, all pre-1800: it, is, a, library (14th c.), in, every,
// house, where, any, book, letter, map (16th c.), or, song, in, the,
// world (Old English), can, be, found, in, a, breath, and, every,
// reader, may, write, back, at, once. No post-1800 coinage: no
// internet / computer / digital / online / website / email / phone /
// television / radio / video / software / data / network / screen /
// pixel, and no modern sense of any of those words.

import { mkdir, readFile, writeFile } from "node:fs/promises";

const SENTENCE =
  "It is a library in every house, where any book, letter, map, or song in the world can be found in a breath, and every reader may write back at once.";

const MAX_LENGTH = 200;

// Words coined after 1800 that must never appear in the entry.
const FORBIDDEN = [
  "internet",
  "computer",
  "digital",
  "online",
  "website",
  "email",
  "phone",
  "television",
  "radio",
  "video",
  "software",
  "data",
  "network",
  "screen",
  "pixel",
];

function check(sentence: string): void {
  if (sentence.length === 0 || sentence.length > MAX_LENGTH) {
    throw new Error(
      `Sentence must be 1-${MAX_LENGTH} characters, got ${sentence.length}.`,
    );
  }
  if (sentence.trim() !== sentence) {
    throw new Error("Sentence must have no leading or trailing whitespace.");
  }
  const stops = sentence.match(/\./g) ?? [];
  if (stops.length !== 1 || !sentence.endsWith(".")) {
    throw new Error("Entry must be exactly one sentence.");
  }
  const words = sentence.toLowerCase().replace(/[^a-z ]/g, "").split(" ");
  for (const bad of FORBIDDEN) {
    if (words.includes(bad)) {
      throw new Error(`Forbidden post-1800 word in entry: ${bad}`);
    }
  }
}

check(SENTENCE);

await mkdir("/output", { recursive: true });
await writeFile("/output/entry.txt", SENTENCE, "utf8");

const back = await readFile("/output/entry.txt", "utf8");
if (back !== SENTENCE) {
  throw new Error("Read-back mismatch: /output/entry.txt does not match.");
}

console.log(
  `Wrote ${SENTENCE.length} characters (${SENTENCE.split(" ").length} words) to /output/entry.txt`,
);
