import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { LoginContextProvider } from "./contextProviders/LoginContextProvider.tsx";
import { NavigationContextProvider } from "./contextProviders/NavigationContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginContextProvider>
        <NavigationContextProvider>
          <App />
        </NavigationContextProvider>
      </LoginContextProvider>
    </BrowserRouter>
  </StrictMode>
);
