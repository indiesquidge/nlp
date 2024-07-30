import React from "react";
import {
  getSortedNotes,
  getNotesAndChordsForKey,
  ChordType,
} from "./guitar-utils";
import type { NoteInfo } from "./guitar-utils";

export default function GetNotesForKey() {
  const sortedNotes = getSortedNotes();
  const [keyNotesAndChords, setKeyNotesAndChords] = React.useState<
    NoteInfo[] | null
  >(null);
  const [selectedNote, setSelectedNote] = React.useState(sortedNotes[0]);
  const [selectedChordType, setSelectedChordType] = React.useState<ChordType>(
    ChordType.Major,
  );
  const updateChordType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedChordType(e.target.value as ChordType);
  };

  const getNotes = () => {
    const notesForKey = getNotesAndChordsForKey(
      selectedNote,
      selectedChordType,
    );
    setKeyNotesAndChords(notesForKey);
  };

  return (
    <div>
      <h1 className="text-bronze text-left lg:text-center mb-4 text-4xl">
        Get notes for key
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="flex bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            <label className="mr-4" htmlFor="chord-select">
              <span className="mr-1">Key</span>
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
          <button className="w-full lg:w-1/3 block mb-10" onClick={getNotes}>
            Get notes
          </button>
        </div>
        {keyNotesAndChords && (
          <table className="w-full md:mx-8 divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-vivid-red uppercase tracking-wider">
                  Note
                </th>
                <th className="p-3 text-left text-xs font-medium text-vivid-red uppercase tracking-wider">
                  Degree
                </th>
                <th className="p-3 text-left text-xs font-medium text-vivid-red uppercase tracking-wider">
                  Chord
                </th>
                <th className="p-3 text-left text-xs font-medium text-vivid-red uppercase tracking-wider">
                  Degree name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {keyNotesAndChords.map(
                ({ note, degree, chordType, degreeName }) => (
                  <tr key={note}>
                    <td className="px-3 text-sm">{note}</td>
                    <td className="px-3 text-sm">{degree}</td>
                    <td className="px-3 text-sm">{chordType}</td>
                    <td className="px-3 text-sm">{degreeName}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
