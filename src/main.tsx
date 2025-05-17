import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LoginContextProvider } from "./contextProviders/LoginContextProvider.tsx";
import { NavigationContextProvider } from "./contextProviders/NavigationContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoginContextProvider>
      <NavigationContextProvider>
        <App />
      </NavigationContextProvider>
    </LoginContextProvider>
  </StrictMode>
);
