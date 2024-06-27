import React from "react";
import { practiceRandomNote } from "./guitar-utils";
import { getColorFromDelay } from "./utils";

const allFretsCount = Array.from({ length: 18 }, (_, i) => i); // [0, 1, 2, ..., 17]

export default function NameTheNote() {
  const [delayValue, setDelayValue] = React.useState(5);
  const [selectedFrets, setSelectedFrets] =
    React.useState<number[]>(allFretsCount);
  const [countdown, setCountdown] = React.useState<number | undefined>(
    undefined,
  );
  const [stringAndFret, setStringAndFret] = React.useState<{
    string: string;
    fret: number;
  } | null>(null);
  const [note, setNote] = React.useState<string | null>(null);

  const onChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelayValue(event.target.valueAsNumber);
  };

  const onStart = () => {
    setDelayValue(Math.max(1, Math.min(9, delayValue)));
    setCountdown(delayValue);

    const updateStates = practiceRandomNote({
      delay: delayValue * 1000,
      fretOptions: selectedFrets,
    });

    setNote(null);
    updateStates(setStringAndFret, setNote);
  };

  const selectFret = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fret = parseInt(event.target.id.replace("fret-", ""));
    if (event.target.checked) {
      setSelectedFrets((prevSelectedFrets) => [...prevSelectedFrets, fret]);
    } else {
      setSelectedFrets((prevSelectedFrets) =>
        prevSelectedFrets.filter((f) => f !== fret),
      );
    }
  };

  const selectAllFrets = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedFrets(allFretsCount);
    } else {
      setSelectedFrets([]);
    }
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
        Name the note
      </h1>
      <div className="lg:grid grid-cols-2 text-start text-2xl">
        <div className="lg:border-r border-gray-300 lg:pr-8">
          <div className="bg-teal-50 dark:bg-teal-950 p-3 rounded mb-8 text-base">
            <div className="mb-4">
              <div className="flex mb-2">
                <span className="mr-2">Frets: </span>
                <label htmlFor="all-frets" className="flex items-center">
                  <input
                    id="all-frets"
                    type="checkbox"
                    className="mr-1 ml-auto"
                    checked={selectedFrets.length === allFretsCount.length}
                    onChange={selectAllFrets}
                  />
                  <span>select all</span>
                </label>
              </div>
              <div className="font-mono grid grid-cols-9 lg:grid-cols-9">
                {allFretsCount.map((fret) => {
                  return (
                    <label key={fret} htmlFor={`fret-${fret}`} className="mx-1">
                      <input
                        id={`fret-${fret}`}
                        type="checkbox"
                        className="mr-1"
                        checked={selectedFrets.includes(fret)}
                        onChange={selectFret}
                      />
                      {fret}
                    </label>
                  );
                })}
              </div>
            </div>
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
            Identify a note on any of the{" "}
            <b className="text-teal-500">{selectedFrets.length}</b> selected
            frets within <b className="text-teal-500">{delayValue}</b> seconds.
          </div>
          <button className="w-full lg:w-1/3 block mb-10" onClick={onStart}>
            Start
          </button>
        </div>
        <div className="text-3xl flex flex-col lg:items-center lg:pl-8 mt-10">
          {stringAndFret && (
            <>
              <div className="mb-4 text-pretty">
                What is the note on string{" "}
                <b className="text-bronze">{stringAndFret?.string}</b> fret{" "}
                <b className="text-bronze">{stringAndFret?.fret}</b>
              </div>
              {(countdown || note) && (
                <div
                  className={`w-full lg:w-fit text-center min-h-6 p-6 rounded
                  ${getColorFromDelay(countdown)}
                  ${countdown && "transition-colors duration-500"}`}
                >
                  {countdown ? `Time remaining: ${countdown}` : note}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
