import { Editor } from "./editor/components";

import "./App.css";
import "./styles/global.css";

// const url = "https://www.radix-ui.com/themes/docs/components/em";
// const url = "https://music.youtube.com/watch?v=YzEjEAZ25hk&list=LM";
// const url = "https://ui.shadcn.com/docs/components/data-table";
// const url = "https://dribbble.com/search/bookmark";

// const handleClick = async () => {
//   try {
//     const response = await fetch(
//       `http://localhost:3007/api/preview?url=${encodeURIComponent(url)}`
//     );

//     const result = await response.json();

//     setData(result);

//     console.log("response", result);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

const data = {
  title: "Data Table",
  description: "Powerful table and datagrids built using TanStack Table.",
  image:
    "https://ui.shadcn.com/og?title=Data%20Table&amp;de…d%20datagrids%20built%20using%20TanStack%20Table.",
  url: "https://ui.shadcn.com/docs/components/data-table",
  siteName: "ui.shadcn.com",
};

function App() {
  return (
    <main className="app">
      <Editor />

      <div className="bookmark">
        <div>
          <p>{data.siteName}</p>

          <span>{data.description}</span>
        </div>

        <img src={data.image} />
      </div>
    </main>
  );
}

export default App;
