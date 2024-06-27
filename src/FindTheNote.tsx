import React from "react";
import { practiceFindingNote } from "./guitar-utils";
import { getColorFromDelay } from "./utils";

export default function FindTheNote() {
  const [delayValue, setDelayValue] = React.useState(5);
  const [onlyNaturalNotes, setOnlyNaturalNotes] = React.useState(false);
  const [countdown, setCountdown] = React.useState<number | undefined>(
    undefined,
  );
  const [stringAndNote, setStringAndNote] = React.useState<{
    string: string;
    note: string;
  } | null>(null);
  const [frets, setFrets] = React.useState<number[] | null>(null);

  const onStart = () => {
    setDelayValue(Math.max(1, Math.min(9, delayValue)));
    setCountdown(delayValue);

    const updateStates = practiceFindingNote({
      delay: delayValue * 1000,
      naturalOnly: onlyNaturalNotes,
    });

    setFrets(null);
    updateStates(setStringAndNote, setFrets);
  };

  const onChangeOnlyNaturalNotes = () => {
    setOnlyNaturalNotes((prevOnlyNaturalNotes) => !prevOnlyNaturalNotes);
  };

  const onChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelayValue(event.target.valueAsNumber);
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
        Find the note
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
            Find the given note on a particular string
          </div>
          <button className="w-full lg:w-1/3 block mb-10" onClick={onStart}>
            Start
          </button>
        </div>
        <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
          {stringAndNote && (
            <>
              <div className="mb-4 text-pretty">
                Find the note{" "}
                <b className="text-bronze">{stringAndNote?.note}</b> on string{" "}
                <b className="text-bronze">{stringAndNote?.string}</b>{" "}
              </div>
              {(countdown || frets) && (
                <div
                  className={`w-full lg:w-fit text-center min-h-6 p-6 rounded
                  ${getColorFromDelay(countdown)}
                  ${countdown && "transition-colors duration-500"}`}
                >
                  {countdown
                    ? `Time remaining: ${countdown}`
                    : `Frets: ${frets?.join(", ")}`}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
