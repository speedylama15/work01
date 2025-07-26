import { useState, useEffect } from "react";

import { Editor } from "./editor/components";

import "./App.css";
import "./editor/styles/global.css";

// const url = "https://www.radix-ui.com/themes/docs/components/em";
const url = "https://music.youtube.com/watch?v=YzEjEAZ25hk&list=LM";
// const url = "https://ui.shadcn.com/docs/components/data-table";
// const url = "https://dribbble.com/search/bookmark";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/preview?url=${encodeURIComponent(url)}`
        );
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (url) {
      fetchData();
    }
  }, []);

  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
