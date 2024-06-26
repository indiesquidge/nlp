export function practiceRandomNote(
  options?: Options,
): (
  setStringAndFret: (value: { string: string; fret: number }) => void,
  setNote: (value: string) => void,
) => void {
  const { fretOptions, delay } = options ?? defaultOptions;
  const strings = Object.values(GuitarString);
  const notes = getNotes();

  // Randomly select a string
  const string = strings[Math.floor(Math.random() * strings.length)];

  // Determine frets to choose from.
  const frets = fretOptions || Array.from({ length: 18 }, (_, i) => i); // 0-17 frets
  const fret = frets[Math.floor(Math.random() * frets.length)];

  // Calculate the note.
  const noteIndex =
    (notes.indexOf(openStringNotes[string as GuitarString]) + fret) %
    notes.length;
  const note = notes[noteIndex];

  return (setStringAndFret, setNote) => {
    setStringAndFret({ string, fret });
    setTimeout(() => {
      setNote(note);
    }, delay);
  };
}

export function practiceFindingNote(
  options?: Options,
): (
  setTarget: (value: { string: string; note: string }) => void,
  setFrets: (value: number[]) => void,
) => void {
  const { naturalOnly, delay } = options ?? defaultOptions;
  const strings = Object.values(GuitarString);
  const notes = naturalOnly ? getNaturalNotes() : getNotes();

  const targetString = strings[Math.floor(Math.random() * strings.length)];
  const targetNote = notes[Math.floor(Math.random() * notes.length)];

  // Find all possible frets for the target note on the target string.
  const frets = findAllFrets(targetNote, targetString);

  return (setTarget, setFrets) => {
    setTarget({ string: targetString, note: targetNote });
    setTimeout(() => {
      setFrets(frets);
    }, delay);
  };
}

// Helper function to find all frets for a note on a string
function findAllFrets(note: string, string: GuitarString) {
  const notes = getNotes();
  const noteIndex = notes.indexOf(note);
  const stringOpenNote = openStringNotes[string];
  const stringOpenNoteIndex = notes.indexOf(stringOpenNote);
  const frets = [];

  // Iterate through all 22 frets
  for (let fret = 0; fret <= 22; fret++) {
    // Calculate the note at the current fret
    if ((stringOpenNoteIndex + fret) % notes.length === noteIndex) {
      frets.push(fret); // Add fret to the array if it matches the target note.
    }
  }

  return frets;
}

export function getChordTriad(
  chordRoot: string,
  chordType: ChordType,
): [string, string, string] {
  const notes = getNotes();
  const noteIndex = findChordRootIndex(chordRoot);

  const majorThirdIndex = (noteIndex + 4) % notes.length;
  const minorThirdIndex = (noteIndex + 3) % notes.length;
  const perfectFifthIndex = (noteIndex + 7) % notes.length;

  const thirdIndex =
    chordType === ChordType.Minor ? minorThirdIndex : majorThirdIndex;

  const triad: [string, string, string] = [
    chordRoot, // Root
    simplifyNote(notes[thirdIndex]), // Third (Major or Minor)
    simplifyNote(notes[perfectFifthIndex]), // Perfect Fifth
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
  const noteIndex = notes.findIndex((note) => {
    const [sharp, flat] = note.split("/");
    return sharp === chordRoot || flat === chordRoot;
  });

  if (noteIndex === -1) {
    throw new Error("Invalid chord root");
  }

  return noteIndex;
}

function simplifyNote(note: string) {
  return note.split("/")[0];
}

const defaultOptions: Options = {
  fretOptions: null,
  delay: 5000,
  naturalOnly: false,
};

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
}
