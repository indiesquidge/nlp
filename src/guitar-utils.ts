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

export function nameTriadNotes(
  options?: Options,
): (
  setTarget: (value: { rootNote: string; chordType: ChordType }) => void,
  setTriad: (value: [string, string, string]) => void,
) => void {
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
    setTimeout(() => {
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
    // Calculate the note at the current fret
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

  const scaleNotes: NoteInfo[] = [];
  let currentIndex = noteIndex;

  degrees.forEach((degree, i) => {
    if (i === 0) {
      scaleNotes.push({
        note: simplifyNote(notes[currentIndex]),
        degree: degree,
        degreeName: degreeNames[i],
        chordType: chordTypeOrder[i],
      });
    } else {
      currentIndex = (currentIndex + scalePattern[i - 1]) % notes.length;
      scaleNotes.push({
        note: simplifyNote(notes[currentIndex]),
        degree: degrees[i],
        degreeName: degreeNames[i],
        chordType: chordTypeOrder[i],
      });
    }
  });

  return scaleNotes;
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
