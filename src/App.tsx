import React from "react";
import "./App.css";
import { practiceRandomNote } from "./guitar-utils";

const colorClasses = [
  "bg-red-900/100",
  "bg-red-900/90",
  "bg-red-900/80",
  "bg-red-900/70",
  "bg-red-900/60",
  "bg-red-900/50",
  "bg-red-900/40",
  "bg-red-900/30",
  "bg-red-900/20",
  "bg-red-900/10",
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
    if (countdown == null) return "bg-transparent";
    if (countdown === 0) return "bg-blue-600/50";
    return colorClasses[countdown - 1];
  };

  const onChangeDelay = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const delay = Math.max(1, Math.min(9, value));
    setDelayValue(delay);
  };

  const onClick = () => {
    setNote(null);
    setCountdown(delayValue);
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
                className={`text-white w-full lg:w-fit text-center min-h-6 p-6 rounded ${getColorFromDelay(countdown)}`}
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
