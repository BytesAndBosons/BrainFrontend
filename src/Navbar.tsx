// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
// CSS
import "./styles/Navbar.css";
// Assets
import brainLogo from "./assets/logo_w.png";
// Helpers
import { loadIndex, IndexJSON } from "./helperFunctions/loadIndex";
// Context
import { LoginContext } from "./contextProviders/LoginContextProvider.tsx";
import { NavigationContext } from "./contextProviders/NavigationContextProvider.tsx";
// React
import { useContext, useEffect, useState } from "react";
import { checkLoggedIn } from "./helperFunctions/checkLoggedIn.ts";



const logout = async (
  setLoggedIn: (_: boolean) => void,
  setNames: (_: (string | null)[]) => void
) => {
  const response = await fetch(
    "https://brain.lucschnell.ch/backend/logout.php",
    {
      method: "POST",
    }
  );

  if (response.ok) {
    // log out user
    setLoggedIn(false);
    setNames([null, null]);
    console.log("Successfully logged out!");
  }
};

export const NavBar: React.FC = () => {
  const { isLoggedIn, setLoggedIn, setNames } = useContext(LoginContext);
  const { setNavigation } = useContext(NavigationContext);

  const defaultIndex: IndexJSON = {}
  const [index, setIndex] = useState(defaultIndex);

  // Check whether user is logged in
  useEffect(() => {
    checkLoggedIn(setLoggedIn, setNames);
  }, []);


  // Load index.json
  useEffect(() => {
    loadIndex().then(ind => setIndex(ind)).catch(err => console.log(err))
  }, []);


  // Restructure summariesJson to have a map {"section": [{"title", "password_protected"}, ]}
  const sections: {
    [key: string]: {
      title: string;
      passwordProtected: boolean;
      summaryKey: string;
    }[];
  } = {};

  Object.keys(index).forEach((key) => {
    const section: string = index[key].section;
    const title: string = index[key].title;
    const summaryKey: string = key;
    const passwordProtected: boolean = index[key].passwordProtected;

    if (!sections[section]) {
      // section not yet added
      sections[section] = [{ title, passwordProtected, summaryKey }];
    } else {
      // section has been added before
      sections[section].push({ title, passwordProtected, summaryKey });
      sections[section].sort(); // sort alphabetically
    }
  });

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="">
          <img
            src={brainLogo}
            alt=""
            onClick={(_) => setNavigation("overview")}
            width="40"
            className="d-inline-block align-text-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Object.keys(sections).map((key) => (
              <NavDropdown key={key} title={key} id="basic-nav-dropdown">
                {sections[key].map((section) => {
                  if (!isLoggedIn && section.passwordProtected) {
                    return (
                      <NavDropdown.Item
                        onClick={(_) => setNavigation(section.summaryKey)}
                        key={section.title}
                      >
                        {"🔒 " + section.title}
                      </NavDropdown.Item>
                    );
                  } else {
                    return (
                      <NavDropdown.Item
                        onClick={(_) => setNavigation(section.summaryKey)}
                        key={section.title}
                      >
                        {section.title}
                      </NavDropdown.Item>
                    );
                  }
                })}
              </NavDropdown>
            ))}
          </Nav>

          <div className="my-3 my-lg-0">
            {isLoggedIn ? (
              <Button
                onClick={(_) => logout(setLoggedIn, setNames)}
                className="btn-sakura"
              >
                Logout
              </Button>
            ) : (
              <Button
                  onClick={(_) => setNavigation("login")}
                  className="btn-sakura"
              >
                Login
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
