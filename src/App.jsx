import { Editor } from "./editor";

import "./App.css";

import "./nodes/Blockquote/css/Blockquote.css";
import "./nodes/Checklist/css/Checkbox.css";
import "./nodes/Checklist/css/Checkmark.css";

import "./nodes/Divider/css/Divider.css";

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
