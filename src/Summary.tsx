import React, { useContext, useEffect, useState } from "react";
import JsxParser from 'react-jsx-parser';
import { NavigationContext } from "./contextProviders/NavigationContextProvider";
import { PdfExportContext } from "./contextProviders/PdfExportContext";
import { Image } from "./summaryComponents/Image";
import { CodeSnippet } from "./summaryComponents/CodeSnippet";
import { Alert, Button, Container } from "react-bootstrap";
import { AccordionSection } from "./summaryComponents/AccordionSection";
import { ColorButton } from "./ColorButton";
import { CustomTable } from "./summaryComponents/CustomTable";
import { TexSnippet } from "./summaryComponents/TexSnippet";
import { SummaryBox } from "./summaryComponents/SummaryBox";


type SummaryResponse = {
  tsx: string;
};


export const Summary: React.FC = () => {
  const { navigation, setNavigation } = useContext(NavigationContext);
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  const [preparingPrint, setPreparingPrint] = useState(false);

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

        const DynamicComponent = () => (<JsxParser components={{ CodeSnippet, TexSnippet, AccordionSection, ColorButton, CustomTable, Image, SummaryBox }} jsx={tsxCode} onError={(err: any) => { console.log(err); }} />);

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

  const handlePrint = async () => {
    if (preparingPrint) return;

    setPreparingPrint(true);

    // Expand every accordion and wait for the collapse animations to finish
    setExpandAll(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Suggests a nicer default filename in the browser's print/save-as-PDF dialog
    const previousTitle = document.title;
    document.title = navigation;

    const restore = () => {
      document.title = previousTitle;
      setExpandAll(false);
      setPreparingPrint(false);
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();
  };

  return (
    <Container className="d-flex flex-column min-vh-100 my-5">
      {error && <Alert variant="danger">{error}</Alert>}
      {Component && (
        <div className="d-flex justify-content-end mb-3 d-print-none">
          <Button className="btn-primary btn-pdf-download" onClick={handlePrint} disabled={preparingPrint}>
            {preparingPrint ? "Preparing…" : "Download PDF"}
          </Button>
        </div>
      )}
      <PdfExportContext.Provider value={{ expandAll }}>
        {Component && <Component />}
      </PdfExportContext.Provider>
    </Container>
  );
};
