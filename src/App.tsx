import "./App.css";
import NameTheNote from "./NameTheNote";
import FindTheNote from "./FindTheNote";
import GetTriadNoets from "./GetTriadNotes";

function App() {
  return (
    <div>
      <div className="mb-10 border-b lg:border-b-0 pb-8">
        <NameTheNote />
      </div>
      <div className="mb-10 border-b lg:border-b-0 pb-8">
        <FindTheNote />
      </div>
      <div>
        <GetTriadNoets />
      </div>
    </div>
  );
}

export default App;
