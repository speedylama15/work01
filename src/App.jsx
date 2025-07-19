import { Editor } from "./editor";

import "./App.css";

import "./nodes/work-in-progress/Blockquote/css/Blockquote.css";
import "./nodes/completed/Checklist/css/Checkbox.css";
import "./nodes/completed/Checklist/css/Checkmark.css";

import "./nodes/work-in-progress/Divider/css/Divider.css";

import "./nodes/completed/BulletList/BulletList.css";
import "./nodes/completed/NumberedList/NumberedList.css";
import "./extensions/Placeholder/Placeholder.css";

function App() {
  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
