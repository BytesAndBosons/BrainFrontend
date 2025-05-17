import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavBar } from "./Navbar.tsx";
import { Overview } from "./Overview.tsx";
import { NavigationContext } from "./contextProviders/NavigationContextProvider.tsx";
import { Summary } from "./Summary.tsx";
import { Login } from "./Login.tsx";

function App() {
  const { navigation } = useContext(NavigationContext);

  return (
    <>
      <NavBar />
      {navigation == "overview" && <Overview />}
      {navigation != "overview" && navigation != "login" && <Summary />}
      {navigation == "login" && <Login />}
    </>
  );
}

export default App;
