import React, { useContext, useEffect, useState } from "react";
import JsxParser from 'react-jsx-parser';
import { NavigationContext } from "./contextProviders/NavigationContextProvider";
import { Image } from "./summaryComponents/Image";
import { CodeSnippet } from "./summaryComponents/CodeSnippet";
import { Alert, Container } from "react-bootstrap";
import { AccordionSection } from "./summaryComponents/AccordionSection";
import { ColorButton } from "./ColorButton";
import { CustomTable } from "./summaryComponents/CustomTable";


type SummaryResponse = {
  tsx: string;
};


export const Summary: React.FC = () => {
  const { navigation, setNavigation } = useContext(NavigationContext);
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.FC | null>(null);

  // Get the summary from the backend
  const loadSummary = async () => {
    let errorOccurred: boolean = false;

    try {
      const response = await fetch(
        "https://brain.lucschnell.ch/backend/get-summary.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summary: navigation }),
        }
      );

      const data: SummaryResponse | { error: string } = await response.json();

      console.log(`Received the following server response: ${response.status}.`);

      if (response.status == 403) {
        // unauthorized
        setNavigation("login");
      } else if (!response.ok) {
        // something else went wrong
        setError(
          (data as { error: string }).error || "Failed to load summary."
        );
        errorOccurred = true;
      }

      // Success
      let tsxCode = (data as SummaryResponse).tsx;

      try {

        const DynamicComponent = () => (<JsxParser components={{ CodeSnippet, AccordionSection, ColorButton, CustomTable, Image }} jsx={tsxCode} onError={(err: any) => { console.log(err); }} />);

        setComponent(() => DynamicComponent);

      } catch (err: any) {
        setError(
          `Something went wrong when trying to parse the .tsx – ${err}.`
        );
        errorOccurred = true;
      }
    } catch (err: any) {
      setError(`Network error – ${err}.`);
      errorOccurred = true;
    }

    if (!errorOccurred) {
      setError(null);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [navigation]);

  return (
    <Container className="d-flex flex-column min-vh-100 my-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {Component && <Component />}
    </Container>
  );
};
