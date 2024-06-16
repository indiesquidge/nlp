export function practiceRandomNote(
  options?: Options,
): (
  setStringAndFret: (value: { string: string; fret: number }) => void,
  setNote: (value: string) => void,
) => void {
  const { fretOptions = null, delay = 5000 } = options ?? {};
  const strings = Object.values(GuitarString);
  const notes = getNotes();

  // Randomly select a string
  const string = strings[Math.floor(Math.random() * strings.length)];

  // Determine frets to choose from.
  const frets = fretOptions || Array.from({ length: 23 }, (_, i) => i); // 0-22 frets
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

function getNotes(): string[] {
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

type Options = {
  fretOptions?: number[];
  delay?: number;
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
