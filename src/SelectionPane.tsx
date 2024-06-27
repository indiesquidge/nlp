import { PracticeComponentNames, HelperComponentNames } from "./constants";

interface SelectionPaneProps {
  showConfigurationPane: boolean;
  toggleConfigurationPane: () => void;
  setCurrentPractice: (practiceName: string) => void;
}

export default function SelectionPane({
  showConfigurationPane,
  toggleConfigurationPane,
  setCurrentPractice,
}: SelectionPaneProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black opacity-0 transition-opacity duration-200 ease-in-out pointer-events-none ${showConfigurationPane ? "opacity-30 pointer-events-auto" : ""}`}
        onClick={toggleConfigurationPane}
      />
      <div
        className={`flex flex-col w-full md:w-1/3 lg:w-1/4 fixed top-0 md:top-2 left-0 md:left-2 bottom-0 md:bottom-2 bg-white dark:bg-gray-800 shadow-md md:rounded-md opacity-0 transition-transform duration-200 ease-in-out transition-opacity duration-100 ease-in-out z-10 pointer-events-none ${showConfigurationPane ? "pointer-events-auto opacity-100" : ""}`}
        style={{
          transform: showConfigurationPane
            ? "translateX(0)"
            : "translateX(-60%)",
        }}
      >
        <button
          className="flex justify-center items-center p-0 w-8 h-8 rounded-full border-black self-end mr-2 mt-2"
          onClick={toggleConfigurationPane}
        >
          X
        </button>
        <h2 className="text-2xl p-3">Practices</h2>
        <div className="mx-6 mb-6">
          {Object.values(PracticeComponentNames).map((name) => {
            return (
              <button
                className="w-full my-2 border-black"
                onClick={() => {
                  setCurrentPractice(name);
                  toggleConfigurationPane();
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
        <h2 className="text-2xl p-3">Helpers</h2>
        <div className="mx-6 mb-6">
          {Object.values(HelperComponentNames).map((name) => {
            return (
              <button
                className="w-full my-2 border-black"
                onClick={() => {
                  setCurrentPractice(name);
                  toggleConfigurationPane();
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
