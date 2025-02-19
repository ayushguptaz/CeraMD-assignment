import React from "react";
import TopBar from "./components/TopBar/TopBar";
import MainSection from "./components/MainSection/MainSection";
import LeftPane from "./components/LeftPane/LeftPane";
import RightPane from "./components/RightPane/RightPane";

import "./App.css"; // Global styles, including background color

function App() {
  return (
    <div className="App">
      <TopBar />
      <MainSection />
      <div className="Panes">
        <LeftPane />
        <RightPane />
      </div>
    </div>
  );
}

export default App;
