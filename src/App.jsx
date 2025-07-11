import { Editor } from "./editor";

import "./App.css";
import "./css/Paragraph.css";
import "./css/BulletList.css";
import "./css/NumberedList.css";
import "./css/Placeholder.css";

import "./nodes/Blockquote/css/Blockquote.css";
import "./nodes/Checklist/css/Checkbox.css";
import "./nodes/Checklist/css/Checkmark.css";

import "./nodes/Divider/css/Divider.css";

function App() {
  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
