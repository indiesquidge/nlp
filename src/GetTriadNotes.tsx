import React from "react";
import { getSortedNotes, getChordTriad, ChordType } from "./guitar-utils";

export default function GetTriadNotes() {
  const sortedNotes = getSortedNotes();
  const [triadNotes, setTriadNotes] = React.useState<
    [string, string, string] | null
  >(null);
  const [selectedNote, setSelectedNote] = React.useState(sortedNotes[0]);
  const [selectedChordType, setSelectedChordType] = React.useState<ChordType>(
    ChordType.Major,
  );
  const updateChordType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChordType(e.target.value as ChordType);
  };

  const getNotesForTriad = () => {
    const triadNotes = getChordTriad(selectedNote, selectedChordType);
    setTriadNotes(triadNotes);
  };

  return (
    <div>
      <h1 className="text-bronze text-left lg:text-center mb-4 text-4xl">
        Get triad notes
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="flex bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            <label className="mr-4" htmlFor="chord-select">
              <span className="mr-1">Chord</span>
              <select
                id="chord-select"
                className="border rounded"
                onChange={(e) => setSelectedNote(e.target.value)}
              >
                {sortedNotes.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="mb-4">
              <legend className="sr-only mb-2">Chord type</legend>
              <span>
                <input
                  type="radio"
                  name="chord-type"
                  id={ChordType.Major}
                  value={ChordType.Major}
                  checked={selectedChordType === ChordType.Major}
                  onChange={updateChordType}
                />
                <label htmlFor="major" className="ml-2 mr-4">
                  {ChordType.Major}
                </label>
              </span>

              <span>
                <input
                  type="radio"
                  name="chord-type"
                  id={ChordType.Minor}
                  value={ChordType.Minor}
                  checked={selectedChordType === ChordType.Minor}
                  onChange={updateChordType}
                />
                <label htmlFor="minor" className="ml-2 mr-4">
                  {ChordType.Minor}
                </label>
              </span>
            </fieldset>
          </div>
          <div className="mb-4 text-pretty">
            Given a major or minor chord, give the triad notes.
          </div>
          <button
            className="w-full lg:w-1/3 block mb-10"
            onClick={getNotesForTriad}
          >
            Get notes
          </button>
        </div>
        {triadNotes && (
          <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
            <div className="w-full lg:w-fit text-center min-h-6 p-6 rounded bg-vivid-cyan-blue text-white">
              {triadNotes.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
