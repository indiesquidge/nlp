import { useState } from "react";
import SelectionPane from "./SelectionPane";
import { ALL_LEARNING_COMPONENTS } from "./constants";

export default function App() {
  const [showConfigurationPane, setShowConfigurationPane] = useState(false);
  const [currentPractice, setCurrentPractice] = useState("Name the note");

  const toggleConfigurationPane = () => {
    setShowConfigurationPane((prev) => !prev);
  };

  return (
    <>
      <header className="flex items-center border-b border-black px-3">
        <div className="flex px-10 mx-auto w-[1280px]">
          <button
            className="border-bronze my-6"
            onClick={() => setShowConfigurationPane((prev) => !prev)}
          >
            Change practice
          </button>
        </div>
      </header>
      <div className="flex justify-center items-center py-8 px-10 mx-auto max-w-[1280px]">
        {Object.entries(ALL_LEARNING_COMPONENTS).map(([name, Component]) => {
          return currentPractice === name ? (
            <div className="my-10 border-b lg:border-b-0 pb-8">
              <Component />
            </div>
          ) : null;
        })}
      </div>
      <SelectionPane
        showConfigurationPane={showConfigurationPane}
        toggleConfigurationPane={toggleConfigurationPane}
        setCurrentPractice={setCurrentPractice}
      />
    </>
  );
}
