import Editor from "./Editor/Editor";

import "./App.css";
import "./styles/global.css";

// const url = "https://www.tiktok.com/@afvofficial/video/7532162984584498445";
// const url = "https://www.instagram.com/p/DM3AKgYs3aX/";
// const url = "https://www.instagram.com/explore/";
// const url = "https://x.com/nepsisblog/status/1946755615470330159";
// const url = "https://open.spotify.com/playlist/37i9dQZF1E35mqYYio36nV";
// const url =
//   "https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu";
// const url = "https://open.spotify.com/track/0MHStU0muAIEMbwdnebYu2";
// const url = "https://orthochristian.com/171620.html";
// const url = "https://www.radix-ui.com/themes/docs/components/em";
// const url = "https://music.youtube.com/watch?v=YzEjEAZ25hk&list=LM";
// const url = "https://ui.shadcn.com/docs/components/data-table";
// const url = "https://dribbble.com/search/bookmark";

function App() {
  // const [data, setData] = useState(null);

  // const handleClick = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3007/api/preview?url=${encodeURIComponent(url)}`
  //     );

  //     const result = await response.json();

  //     setData(result);

  //     // FIX
  //     console.log("response", result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  return (
    <main className="app">
      <Editor />
    </main>
  );
}

export default App;
