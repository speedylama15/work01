import { useState, useEffect } from "react";
import {
  MemoryRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  HashRouter,
} from "react-router";

// component
import Editor from "./components/Editor/Editor";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
// component

// style
import "./App.css";
import "./styles/Block.css";
import "./styles/List.css";
import "./styles/Verse.css";
// style

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home</h1>

      <Link to="/dashboard">Dashboard</Link>

      <button onClick={() => navigate("/settings")}>Go to Settings</button>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ backgroundColor: "salmon", width: "100%", height: "100%" }}>
      <h1>Dashboard</h1>
    </div>
  );
}

function Settings() {
  return (
    <div style={{ backgroundColor: "skyblue", width: "100%", height: "100%" }}>
      <h1>Settings</h1>
    </div>
  );
}

const App = () => {
  return (
    <div className="page">
      <Sidebar />

      <div className="content-body">
        <Header />

        <div className="content-area">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Editor />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </div>
  );
};

export default App;
