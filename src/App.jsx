import { Editor } from "./editor";

import "./App.css";

import "./nodes/Blockquote/Blockquote.css";
import "./nodes/Checklist/Checkbox.css";
import "./nodes/Checklist/Checkmark.css";

import "./nodes/Divider/Divider.css";

import "./nodes/BulletList/BulletList.css";
import "./nodes/NumberedList/NumberedList.css";

import "./extensions/Placeholder/Placeholder.css";

function App() {
  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
