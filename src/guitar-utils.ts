export function practiceRandomNote(
  options?: Options,
): (
  setStringAndFret: (value: { string: string; fret: number }) => void,
  setNote: (value: string) => void,
) => ReturnType<typeof setTimeout> {
  const { fretOptions, delay } = options ?? defaultOptions;
  const strings = Object.values(GuitarString);
  const notes = getNotes();

  // Randomly select a string
  const string = strings[Math.floor(Math.random() * strings.length)];

  // Determine frets to choose from.
  const frets = fretOptions || Array.from({ length: 18 }, (_, i) => i); // 0-17 frets
  const fret = frets[Math.floor(Math.random() * frets.length)];

  // Starting from the open string's note index, count up by the fret number.
  // % notes.length wraps around the 12-note chromatic scale, so fret 12 lands
  // back on the same note as fret 0 (one octave up), fret 13 = fret 1, etc.
  const noteIndex =
    (notes.indexOf(openStringNotes[string as GuitarString]) + fret) %
    notes.length;
  const note = notes[noteIndex];

  return (setStringAndFret, setNote) => {
    setStringAndFret({ string, fret });
    return setTimeout(() => {
      setNote(note);
    }, delay);
  };
}

export function practiceFindingNote(
  options?: Options,
): (
  setTarget: (value: { string: string; note: string }) => void,
  setFrets: (value: number[]) => void,
) => ReturnType<typeof setTimeout> {
  const { naturalOnly, delay } = options ?? defaultOptions;
  const strings = Object.values(GuitarString);
  const notes = naturalOnly ? getNaturalNotes() : getNotes();

  const targetString = strings[Math.floor(Math.random() * strings.length)];
  const targetNote = notes[Math.floor(Math.random() * notes.length)];

  // Find all possible frets for the target note on the target string.
  const frets = findAllFrets(targetNote, targetString);

  return (setTarget, setFrets) => {
    setTarget({ string: targetString, note: targetNote });
    return setTimeout(() => {
      setFrets(frets);
    }, delay);
  };
}

export function nameTriadNotes(
  options?: Options,
): (
  setTarget: (value: { rootNote: string; chordType: ChordType }) => void,
  setTriad: (value: [string, string, string]) => void,
) => ReturnType<typeof setTimeout> {
  const { delay, naturalOnly } = options ?? defaultOptions;
  const chordTypes = Object.values(ChordType);
  const notes = naturalOnly ? getNaturalNotes() : getNotes();

  const rootNote = simplifyNote(
    notes[Math.floor(Math.random() * notes.length)],
  );
  const chordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
  const triad = getChordTriad(rootNote, chordType);

  return (setTarget, setTriad) => {
    setTarget({ rootNote, chordType });
    return setTimeout(() => {
      setTriad(triad);
    }, delay);
  };
}

function findAllFrets(note: string, string: GuitarString) {
  const notes = getNotes();
  const noteIndex = notes.indexOf(note);
  const stringOpenNote = openStringNotes[string];
  const stringOpenNoteIndex = notes.indexOf(stringOpenNote);
  const frets = [];

  // Iterate through all 22 frets
  for (let fret = 0; fret <= 22; fret++) {
    // Each fret raises the pitch by one semitone, so adding the fret number to
    // the open string's note index gives the note at that fret. % notes.length
    // wraps the 12-note chromatic array so the same note recurs every 12 frets.
    if ((stringOpenNoteIndex + fret) % notes.length === noteIndex) {
      frets.push(fret); // Add fret to the array if it matches the target note.
    }
  }

  return frets;
}

export function getNotesAndChordsForKey(
  chordRoot: string,
  chordType: ChordType,
): NoteInfo[] {
  const notes = getNotes();
  const noteIndex = findChordRootIndex(chordRoot);
  // Scale pattern is the sequence of semitone steps between consecutive degrees.
  // Applying them one at a time (rather than absolute intervals from the root)
  // lets us walk the chromatic array degree by degree.
  const scalePattern = getScalePattern(chordType);

  const degreeNamesMajor = [
    "tonic",
    "supertonic",
    "mediant",
    "subdominant",
    "dominant",
    "submediant or relative minor",
    "leading tone",
  ];
  const degreeNamesMinor = [
    "tonic",
    "supertonic",
    "mediant",
    "subdominant",
    "dominant",
    "submediant",
    "subtonic",
  ];

  const degrees =
    chordType === ChordType.Major
      ? ["I", "ii", "iii", "IV", "V", "vi", "vii°"]
      : ["i", "ii°", "III", "iv", "v", "VI", "VII"];
  const degreeNames =
    chordType === ChordType.Major ? degreeNamesMajor : degreeNamesMinor;

  const chordTypeOrder = getChordTypesOrder(chordType);
  const rootLetterIndex = SCALE_LETTERS.indexOf(chordRoot[0]);

  const scaleNotes: NoteInfo[] = [];
  let currentIndex = noteIndex;

  degrees.forEach((degree, i) => {
    if (i > 0) {
      // Add the step size for the previous degree to advance to the next one.
      // scalePattern[i-1] is the interval *from* degree i-1 *to* degree i.
      // % notes.length wraps around the chromatic array (e.g. B → C).
      currentIndex = (currentIndex + scalePattern[i - 1]) % notes.length;
    }
    // Each degree of a scale uses a different letter (C D E F G A B).
    // Adding i to the root's letter index (mod 7) gives the correct letter
    // for that degree without skipping or repeating any letter.
    const letter = SCALE_LETTERS[(rootLetterIndex + i) % 7];
    scaleNotes.push({
      note: spellScaleNote(currentIndex, letter),
      degree: degree,
      degreeName: degreeNames[i],
      chordType: chordTypeOrder[i],
    });
  });

  return scaleNotes;
}

export function getSeventhChord(
  chordRoot: string,
  chordType: SeventhChordType,
): [string, string, string, string] {
  const noteIndex = findChordRootIndex(chordRoot);
  const rootLetterIndex = SCALE_LETTERS.indexOf(chordRoot[0]);
  const intervals = getSeventhChordIntervals(chordType);

  return intervals.map((interval, i) => {
    // interval is the number of semitones above the root for this chord tone.
    // % 12 wraps around the chromatic scale for intervals that exceed B (e.g.
    // a major 7th above B lands on A#/B♭, which is index 10, not 22).
    const semitone = (noteIndex + interval) % 12;
    // Seventh chord tones are: root (i=0), third (i=1), fifth (i=2), seventh (i=3).
    // Each skips one letter, so we advance by 2 letters per chord tone (mod 7).
    // e.g. C major 7 → letters C(0), E(2), G(4), B(6)
    const letter = SCALE_LETTERS[(rootLetterIndex + i * 2) % 7];
    return spellScaleNote(semitone, letter);
  }) as [string, string, string, string];
}

function getSeventhChordIntervals(
  chordType: SeventhChordType,
): [number, number, number, number] {
  switch (chordType) {
    case SeventhChordType.Major7:
      return [0, 4, 7, 11]; // root, major third, perfect fifth, major seventh
    case SeventhChordType.Minor7:
      return [0, 3, 7, 10]; // root, minor third, perfect fifth, minor seventh
    case SeventhChordType.Dominant7:
      return [0, 4, 7, 10]; // root, major third, perfect fifth, minor seventh
  }
}

export function getChordTriad(
  chordRoot: string,
  chordType: ChordType,
): [string, string, string] {
  const notes = getNotes();
  const noteIndex = findChordRootIndex(chordRoot);

  // Semitone intervals from root: major 3rd = 4, minor 3rd = 3,
  // perfect 5th = 7, diminished 5th = 6.
  // % notes.length wraps around the 12-note array (e.g. A + 4 = C#, not index 13).
  const majorThirdIndex = (noteIndex + 4) % notes.length;
  const minorThirdIndex = (noteIndex + 3) % notes.length;
  const perfectFifthIndex = (noteIndex + 7) % notes.length;
  const diminishedFifthIndex = (noteIndex + 6) % notes.length;

  const thirdIndex =
    chordType === ChordType.Major ? majorThirdIndex : minorThirdIndex;
  const fifthIndex =
    chordType === ChordType.Diminished
      ? diminishedFifthIndex
      : perfectFifthIndex;

  // Triad tones always use letters root, root+2, root+4 (every other letter).
  // e.g. C = index 0 → third = E (index 2), fifth = G (index 4)
  const rootLetterIndex = SCALE_LETTERS.indexOf(chordRoot[0]);
  const thirdLetter = SCALE_LETTERS[(rootLetterIndex + 2) % 7];
  const fifthLetter = SCALE_LETTERS[(rootLetterIndex + 4) % 7];

  const triad: [string, string, string] = [
    chordRoot,
    spellScaleNote(thirdIndex, thirdLetter),
    spellScaleNote(fifthIndex, fifthLetter),
  ];

  return triad;
}

export function getNotes(): string[] {
  return [
    "C",
    "C#/D♭",
    "D",
    "D#/E♭",
    "E",
    "F",
    "F#/G♭",
    "G",
    "G#/A♭",
    "A",
    "A#/B♭",
    "B",
  ];
}

function getChordTypesOrder(chordType: ChordType): ChordType[] {
  if (chordType === ChordType.Major) {
    return [
      ChordType.Major,
      ChordType.Minor,
      ChordType.Minor,
      ChordType.Major,
      ChordType.Major,
      ChordType.Minor,
      ChordType.Diminished,
    ];
  }

  return [
    ChordType.Minor,
    ChordType.Diminished,
    ChordType.Major,
    ChordType.Minor,
    ChordType.Minor,
    ChordType.Major,
    ChordType.Major,
  ];
}

function getNaturalNotes(): string[] {
  return ["C", "D", "E", "F", "G", "A", "B"];
}

export function getSortedNotes(): string[] {
  const notes = getNotes();
  const naturalNotes = notes.filter((note) => !note.includes("#"));
  const sharpFlatNotes = notes.filter((note) => note.includes("#"));
  return [...naturalNotes, ...sharpFlatNotes];
}

function findChordRootIndex(chordRoot: string) {
  const notes = getNotes();
  const normalizedChordRoot = simplifyNote(chordRoot);
  const noteIndex = notes.findIndex((note) => {
    const [sharp, flat] = note.split("/");
    return sharp === normalizedChordRoot || flat === normalizedChordRoot;
  });

  if (noteIndex === -1) {
    throw new Error(`Invalid chord root: ${chordRoot}`);
  }

  return noteIndex;
}

function simplifyNote(note: string) {
  return note.split("/")[0];
}

// The 7 letter names used in Western music, in chromatic order.
// Used to determine which letter a scale degree or chord tone should use,
// independent of whether it needs a sharp or flat accidental.
const SCALE_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

// The semitone index (0–11) of each letter's natural (unaltered) pitch.
const LETTER_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

// Given a chromatic index (0–11) and the letter the note *should* be spelled
// with, returns the correctly spelled note name (e.g. natural, sharp, or flat).
//
// How it works:
//   diff = (actual semitone − natural semitone for that letter + 12) % 12
//   The +12 before the modulo prevents negative results when the actual semitone
//   is lower than the letter's natural position (e.g. B♭: 10 − 11 = −1 → +12 = 11).
//   diff 0  → natural  (e.g. letter E at semitone 4  → "E")
//   diff 1  → sharp    (e.g. letter F at semitone 6  → "F#")
//   diff 11 → flat     (e.g. letter B at semitone 10 → "B♭")  ← same as diff -1 mod 12
//   diff 2  → double sharp (rare, e.g. G## in exotic keys)
//   diff 10 → double flat  (rare, e.g. B𝄫 in exotic keys)
function spellScaleNote(semitoneIndex: number, letter: string): string {
  const natural = LETTER_SEMITONES[letter];
  const diff = (semitoneIndex - natural + 12) % 12;
  if (diff === 0) return letter;
  if (diff === 1) return letter + "#";
  if (diff === 11) return letter + "♭";
  if (diff === 2) return letter + "𝄪"; // double sharp
  if (diff === 10) return letter + "𝄫"; // double flat
  return letter;
}

function getScalePattern(chordType: ChordType): number[] {
  switch (chordType) {
    case ChordType.Major:
      return [2, 2, 1, 2, 2, 2, 1]; // W, W, H, W, W, W, H
    case ChordType.Minor:
      return [2, 1, 2, 2, 1, 2, 2]; // W, H, W, W, H, W, W
    default:
      throw new Error("Invalid chord type");
  }
}

const defaultOptions: Options = {
  fretOptions: null,
  delay: 5000,
  naturalOnly: false,
};

export interface NoteInfo {
  note: string;
  degree: string;
  degreeName: string;
  chordType: ChordType;
}

type Options = {
  fretOptions?: number[] | null;
  delay?: number;
  naturalOnly?: boolean;
};

enum GuitarString {
  E = "E",
  A = "A",
  D = "D",
  G = "G",
  B = "B",
  e = "e", // High E string
}

const openStringNotes: Record<GuitarString, string> = {
  [GuitarString.E]: "E",
  [GuitarString.A]: "A",
  [GuitarString.D]: "D",
  [GuitarString.G]: "G",
  [GuitarString.B]: "B",
  [GuitarString.e]: "E", // High E string has the same open note as low E string.
};

export enum ChordType {
  Major = "major",
  Minor = "minor",
  Diminished = "diminished",
}

export enum SeventhChordType {
  Major7 = "Δ7",
  Minor7 = "m7",
  Dominant7 = "7",
}
