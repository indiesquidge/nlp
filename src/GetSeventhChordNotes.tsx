import React from "react";
import {
  getSortedNotes,
  getSeventhChord,
  SeventhChordType,
} from "./guitar-utils";

export default function GetSeventhChordNotes() {
  const sortedNotes = getSortedNotes();
  const [chordNotes, setChordNotes] = React.useState<
    [string, string, string, string] | null
  >(null);
  const [selectedNote, setSelectedNote] = React.useState(
    sortedNotes[0].split("/")[0],
  );
  const [selectedChordType, setSelectedChordType] =
    React.useState<SeventhChordType>(SeventhChordType.Major7);

  const updateChordType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChordType(e.target.value as SeventhChordType);
  };

  const getNotes = () => {
    setChordNotes(getSeventhChord(selectedNote, selectedChordType));
  };

  return (
    <div>
      <h1 className="text-bronze text-left lg:text-center mb-4 text-4xl">
        Get seventh chord notes
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="flex flex-wrap bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            <label className="mr-4" htmlFor="chord-select">
              <span className="mr-1">Chord</span>
              <select
                id="chord-select"
                className="border rounded"
                onChange={(e) => setSelectedNote(e.target.value)}
              >
                {sortedNotes.map((note) => (
                  <option key={note} value={note.split("/")[0]}>
                    {note}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="mb-4">
              <legend className="sr-only mb-2">Chord type</legend>
              {Object.values(SeventhChordType).map((type) => (
                <span key={type}>
                  <input
                    type="radio"
                    name="chord-type"
                    id={type}
                    value={type}
                    checked={selectedChordType === type}
                    onChange={updateChordType}
                  />
                  <label htmlFor={type} className="ml-2 mr-4">
                    {type}
                  </label>
                </span>
              ))}
            </fieldset>
          </div>
          <div className="mb-4 text-pretty">
            Given a seventh chord type, give the four notes.
          </div>
          <button className="w-full lg:w-1/2 block mb-10" onClick={getNotes}>
            Get notes
          </button>
        </div>
        {chordNotes && (
          <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
            <div className="w-full lg:w-fit text-center min-h-6 p-6 rounded bg-vivid-cyan-blue text-white">
              {chordNotes.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
