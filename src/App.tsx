import React from "react";
import "./App.css";
import { practiceRandomNote } from "./guitar-utils";

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

function App() {
  const [delayValue, setDelayValue] = React.useState(5);
  const [countdown, setCountdown] = React.useState<number | undefined>(
    undefined,
  );
  const [stringAndFret, setStringAndFret] = React.useState<{
    string: string;
    fret: number;
  } | null>(null);
  const [note, setNote] = React.useState<string | null>(null);

  const getColorFromDelay = (countdown?: number) => {
    if (countdown === undefined) return "bg-transparent";
    if (countdown === 0) return ["bg-vivid-cyan-blue", "text-white"].join(" ");
    return colorClasses[countdown - 1].join(" ");
  };

  const onChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelayValue(event.target.valueAsNumber);
  };

  const onClick = () => {
    setDelayValue(Math.max(1, Math.min(9, delayValue)));
    setCountdown(delayValue);
    setNote(null);

    const updateStates = practiceRandomNote({ delay: delayValue * 1000 });
    updateStates(setStringAndFret, setNote);
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
    <div className="lg:grid grid-cols-2 text-start text-2xl">
      <div className="border-b lg:border-b-0 lg:border-r border-gray-300 lg:pr-8">
        <h1 className="text-bronze mb-4 text-4xl">Name the note</h1>
        <div className="mb-4">
          Name a note at any random location on the fretboard within{" "}
          <input
            className="w-9 border rounded mx-1"
            type="number"
            min="1"
            max="9"
            value={delayValue}
            onChange={onChangeDelay}
          />{" "}
          seconds.
        </div>
        <button className="w-full lg:w-1/3 block mb-10" onClick={onClick}>
          Start
        </button>
      </div>
      <div className="text-3xl flex flex-col lg:items-center mt-10">
        {stringAndFret && (
          <>
            <div className="mb-4">
              What is the note on{" "}
              <div className="lg:inline">
                string <b className="text-bronze">{stringAndFret?.string}</b>{" "}
                fret <b className="text-bronze">{stringAndFret?.fret}</b>
              </div>
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
  );
}

export default App;
