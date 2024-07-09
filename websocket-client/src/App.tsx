import React from "react";
import "./App.css";
import Talk from "./components/Talk";
import AirController from "./components/AirController";

const App: React.FC = () => {
  return (
    <div className="App">
      <AirController />
      <Talk />
    </div>
  );
};

export default App;
