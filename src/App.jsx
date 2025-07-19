import { Editor } from "./editor";

import "./App.css";

import "./nodes/Checklist/css/Checkbox.css";
import "./nodes/Checklist/css/Checkmark.css";
import "./nodes/BulletList/css/BulletList.css";
import "./nodes/NumberedList/css/NumberedList.css";

import "./extensions/Placeholder/Placeholder.css";
import "./extensions/DragAndDropNode/DragAndDropNode.css";

function App() {
  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
