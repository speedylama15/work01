// import Editor from "./editor/Editor";

// import "./App.css";
// import "./styles/global.css";

// function App() {
//   return (
//     <main className="app">
//       <Editor />
//     </main>
//   );
// }

// export default App;

import { useState } from "react";

import Editor from "./editor/Editor";

import "./App.css";
import "./styles/global.css";

function App() {
  const [url, setUrl] = useState("https://github.com/microsoft/vscode");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUnfurl = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `http://localhost:3007/api/preview?url=${encodeURIComponent(url)}`
      );

      const result = await response.json();

      console.log(result);

      setResult(result);
    } catch (err) {
      console.error("Unfurl error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      {/* <div className="bar">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to unfurl"
        />

        <button onClick={handleUnfurl} disabled={loading}>
          {loading ? "Loading..." : "Unfurl"}
        </button>
      </div>

      <div className="bookmark">
        <div className="bookmark-left">
          <img src={result?.open_graph?.images[0].url} />
        </div>

        <div className="bookmark-right">
          <div className="header">
            <img src={result?.favicon} />
            <span>{result?.open_graph?.site_name}</span>
          </div>

          <div className="body">
            <p>{result?.title}</p>
            <span>{result?.open_graph?.description}</span>
          </div>
        </div>
      </div> */}

      <Editor />
    </main>
  );
}

export default App;
