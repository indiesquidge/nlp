import React from "react";
import { nameTriadNotes } from "./guitar-utils";
import type { ChordType } from "./guitar-utils";

const colorClasses = [
  ["bg-red-900", "text-white"],
  ["bg-red-800", "text-white"],
  ["bg-red-700", "text-white"],
  ["bg-red-600", "text-white"],
  ["bg-red-500", "text-white"],
  ["bg-red-400", "text-black"],
  ["bg-red-300", "text-black"],
  ["bg-red-200", "text-black"],
  ["bg-red-100", "text-black"],
  ["bg-red-50", "text-black"],
];

export default function NameTriadNotes() {
  const [delayValue, setDelayValue] = React.useState(5);
  const [onlyNaturalNotes, setOnlyNaturalNotes] = React.useState(true);
  const [countdown, setCountdown] = React.useState<number | undefined>(
    undefined,
  );
  const [rootNoteAndChordType, setRootNoteAndChordType] = React.useState<{
    rootNote: string;
    chordType: ChordType;
  } | null>(null);
  const [triadNotes, setTriadNotes] = React.useState<
    [string, string, string] | null
  >(null);

  const getColorFromDelay = (countdown?: number) => {
    if (countdown === undefined) return "bg-transparent";
    if (countdown === 0) return ["bg-vivid-cyan-blue", "text-white"].join(" ");
    return colorClasses[countdown - 1].join(" ");
  };

  const onStart = () => {
    setDelayValue(Math.max(1, Math.min(9, delayValue)));
    setCountdown(delayValue);

    const updateStates = nameTriadNotes({
      delay: delayValue * 1000,
      naturalOnly: onlyNaturalNotes,
    });

    setTriadNotes(null);
    updateStates(setRootNoteAndChordType, setTriadNotes);
  };

  const onChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelayValue(event.target.valueAsNumber);
  };

  const onChangeOnlyNaturalNotes = () => {
    setOnlyNaturalNotes((prevOnlyNaturalNotes) => !prevOnlyNaturalNotes);
  };

  React.useEffect(() => {
    let timer: number | undefined = undefined;

    if (countdown != null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) =>
          prevCountdown != null ? prevCountdown - 1 : undefined,
        );
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  return (
    <div>
      <h1 className="text-bronze text-left lg:text-center mb-4 text-4xl">
        Name the triad notes
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            <label className="block mb-4" htmlFor="only-natural-notes-checkbox">
              <input
                id="only-natural-notes-checkbox"
                className="mr-1"
                type="checkbox"
                checked={onlyNaturalNotes}
                onChange={onChangeOnlyNaturalNotes}
              />
              Natural notes only
            </label>
            <label htmlFor="delay-value">
              Delay:{" "}
              <input
                id="delay-value"
                className="w-9 border rounded mx-1"
                type="number"
                min="1"
                max="9"
                value={delayValue}
                onChange={onChangeDelay}
              />{" "}
              seconds
            </label>
          </div>
          <div className="mb-4 text-pretty">
            Find the triad notes for the given chord
          </div>
          <button className="w-full lg:w-1/3 block mb-10" onClick={onStart}>
            Start
          </button>
        </div>
        <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
          {rootNoteAndChordType && (
            <>
              <div className="mb-4 text-pretty">
                What are the triad notes in the{" "}
                <b className="text-bronze text-nowrap">
                  {`${rootNoteAndChordType.rootNote} ${rootNoteAndChordType.chordType}`}
                </b>{" "}
                chord?
              </div>
              {(countdown || triadNotes) && (
                <div
                  className={`w-full lg:w-fit text-center min-h-6 p-6 rounded
                  ${getColorFromDelay(countdown)}
                  ${countdown && "transition-colors duration-500"}`}
                >
                  {countdown
                    ? `Time remaining: ${countdown}`
                    : triadNotes?.join(", ")}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
