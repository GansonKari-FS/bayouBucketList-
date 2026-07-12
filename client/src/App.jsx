import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddAdventure from "./pages/AddAdventure";
import AdventureDetails from "./pages/AdventureDetails";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddAdventure />} />
        <Route
          path="/experiences/:id"
          element={<AdventureDetails />}
        />
      </Routes>
    </>
  );
}

export default App;