import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import { NavBar } from "./Navbar.tsx";
import { Overview } from "./Overview.tsx";
import { Summary } from "./Summary.tsx";
import { Login } from "./Login.tsx";
import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Summary />} />
      </Routes>
    </>
  );
}

export default App;
