// Bootstrap
import { Container } from "react-bootstrap";
import { ColorButton } from "./ColorButton";
// Context
import { LoginContext } from "./contextProviders/LoginContextProvider";
// Helpers
import { checkLoggedIn } from "./helperFunctions/checkLoggedIn";
import { loadIndex, IndexJSON } from "./helperFunctions/loadIndex";
// React
import { useContext, useEffect, useState } from "react";

export const Overview: React.FC = () => {
  const { isLoggedIn, setLoggedIn, names, setNames } = useContext(LoginContext);

  const defaultIndex:IndexJSON = {};
  const [index, setIndex] = useState(defaultIndex);

  // Check whether user is logged in
  useEffect(() => {
    checkLoggedIn(setLoggedIn, setNames);
  }, []);

  // Load index.json
  useEffect(() => {
    loadIndex().then(ind => setIndex(ind)).catch(err => console.log(err))
  }, []);

  return (
    <>
      <Container className="d-flex flex-column min-vh-100 my-5">
        <h1>Cheat Sheets</h1>

        {isLoggedIn ? (
          <p>
            <b>Welcome back{names[0] && `, ${names[0]}`}!</b> <br />
            You made it to the restricted section...
          </p>
        ) : (
          <p>
            On this page I collect personal cheat sheets for different coding
            languages or frameworks.
          </p>
        )}

        <hr className="col-1 my-4" />

        <div className="d-flex flex-wrap gap-2">
          {Object.keys(index).map((key) => {
            return (<ColorButton key={key} ref={key}>{index[key].title}</ColorButton>)
          })}
        </div>
      </Container>
    </>
  );
};
