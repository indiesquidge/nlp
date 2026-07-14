import React from "react";
import { getChordTriad, getSortedNotes, ChordType } from "./guitar-utils";

const STRING_SETS = [
  ["E", "A", "D"],
  ["A", "D", "G"],
  ["D", "G", "B"],
  ["G", "B", "e"],
] as const;

const INVERSION_LABELS = [
  "root position",
  "first inversion",
  "second inversion",
] as const;

interface TriadPrompt {
  rootNote: string;
  chordType: ChordType;
  inversion: number;
  strings: [string, string, string];
  triadNotes: [string, string, string];
}

function getRandomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomStringSet(): [string, string, string] {
  return [...getRandomItem(STRING_SETS)] as [string, string, string];
}

function getRandomTriadPrompt(): TriadPrompt {
  const sortedNotes = getSortedNotes();
  const rootNote = getRandomItem(sortedNotes);
  const chordType = getRandomItem([ChordType.Major, ChordType.Minor]);
  const inversion = Math.floor(Math.random() * 3);
  const triadNotes = getChordTriad(rootNote, chordType);

  const inversionNotes: [string, string, string] =
    inversion === 0
      ? triadNotes
      : inversion === 1
        ? [triadNotes[1], triadNotes[2], triadNotes[0]]
        : [triadNotes[2], triadNotes[0], triadNotes[1]];

  return {
    rootNote,
    chordType,
    inversion,
    strings: getRandomStringSet(),
    triadNotes: inversionNotes,
  };
}

export default function PlayRandomTriad() {
  const [prompt, setPrompt] = React.useState<TriadPrompt | null>(null);

  const onStart = () => {
    setPrompt(getRandomTriadPrompt());
  };

  return (
    <div>
      <h1 className="text-bronze text-left lg:text-center mb-4 text-4xl">
        Play a random triad
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            This practice gives you a random triad, inversion, and string set.
          </div>
          <div className="mb-4 text-pretty">
            Generate a random triad and play it on the specified strings.
          </div>
          <button className="w-full lg:w-1/3 block mb-10" onClick={onStart}>
            Start
          </button>
        </div>
        <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
          {prompt && (
            <>
              <div className="mb-4 text-pretty text-center">
                Play the {INVERSION_LABELS[prompt.inversion]} of a {prompt.rootNote}{" "}
                {prompt.chordType} on the strings {prompt.strings.join(", ")}.
              </div>
              <div className="w-full lg:w-fit text-center min-h-6 p-6 rounded bg-vivid-cyan-blue text-white text-base">
                Suggested notes: {prompt.triadNotes.join(", ")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
