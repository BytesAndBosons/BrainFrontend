import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LoginContextProvider } from "./contextProviders/LoginContextProvider.tsx";
import { NavigationContextProvider } from "./contextProviders/NavigationContextProvider.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoginContextProvider>
        <NavigationContextProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:section/*" element={<App />} />
          </Routes>
        </NavigationContextProvider>
      </LoginContextProvider>
    </BrowserRouter>
  </StrictMode>
);
