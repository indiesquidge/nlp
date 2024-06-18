import "./App.css";
import NameTheNote from "./NameTheNote";
import FindTheNote from "./FindTheNote";

function App() {
  return (
    <div>
      <div className="mb-10 border-b lg:border-b-0 pb-8">
        <NameTheNote />
      </div>
      <div>
        <FindTheNote />
      </div>
    </div>
  );
}

export default App;
