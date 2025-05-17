import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { NavigationContext } from "./contextProviders/NavigationContextProvider";
import { LoginContext } from "./contextProviders/LoginContextProvider";

type LoginResponse = {
  first: string;
  last: string;
};

export const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const { setNavigation } = useContext(NavigationContext);
  const { setLoggedIn, setNames } = useContext(LoginContext);

  const sendLoginData = async (formData: FormData) => {
    const username = formData.get("username") ?? "";
    const password = formData.get("password") ?? "";

    const response = await fetch(
      "https://brain.lucschnell.ch/backend/login.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      }
    );

    const data: LoginResponse | { error: string } = await response.json();

    console.log(data);

    if (!response.ok) {
      // something went wrong
      setError((data as { error: string }).error || "Failed to log in.");
    } else {
      // Do success things
      setLoggedIn(true);
      setNames([(data as LoginResponse).first, (data as LoginResponse).last]);
      setNavigation("overview");
    }
  };

  return (
    <Container className="d-flex flex-column min-vh-100 my-5">
      <h1>Login</h1>
      <div className="col-lg-8 px-0">
        <hr className="col-1 my-4" />

        {
          // No error occurred
          !error && (
            <div className="alert alert-dark" role="alert">
              In order to access certain cheat sheets, you have to provide{" "}
              <b>login credentials</b>.
            </div>
          )
        }

        {
          // Error occurred
          error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )
        }

        <form action={sendLoginData}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              👤
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              id="username"
              name="username"
              aria-label="username"
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              🔒
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password"
              name="password"
              aria-label="password"
              aria-describedby="basic-addon1"
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-block">
            Login
          </button>
        </form>
      </div>
    </Container>
  );
};
