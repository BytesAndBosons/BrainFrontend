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


// react-jsx-parser keeps JSX text verbatim, so a line break (e.g. inserted by Prettier) between text and an inline
// element or punctuation turns into a visible space. Real JSX drops that whitespace, so we do the same here.
const cleanJsxText = (text: string): string => {
  if (!/[\r\n]/.test(text)) return text;

  const lines = text.split(/\r\n|\n|\r/);
  const lastNonEmpty = lines.reduce((last, line, i) => (/[^ \t]/.test(line) ? i : last), -1);

  return lines
    .map((line, i) => {
      let trimmed = line.replace(/\t/g, " ");
      if (i > 0) trimmed = trimmed.replace(/^ +/, "");
      if (i < lines.length - 1) trimmed = trimmed.replace(/ +$/, "");
      return trimmed && i !== lastNonEmpty ? `${trimmed} ` : trimmed;
    })
    .join("");
};

// Only touches text between tags/expressions; template literals (e.g. CodeSnippet contents) are left as they are.
// react-jsx-parser also drops whitespace-only string expressions, so the explicit space `{" "}` is rewritten to the
// equivalent entity `&#32;` (after the text cleanup above, so it is not trimmed away).
const normalizeJsxWhitespace = (jsx: string): string =>
  jsx
    .split(/(`(?:\\[\s\S]|[^`\\])*`)/)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part.replace(/(?<=[>}])[^<>{}]+(?=[<{])/g, cleanJsxText).replace(/\{\s*(["'])\s+\1\s*\}/g, "&#32;")
    )
    .join("");

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
      // Prettier may prepend a ";" to the leading fragment, so we strip it
      let tsxCode = normalizeJsxWhitespace((data as SummaryResponse).tsx.replace(/^\s*;+/, ""));

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
            {preparingPrint ? "Preparing…" : "Create PDF"}
          </Button>
        </div>
      )}
      <PdfExportContext.Provider value={{ expandAll }}>
        {Component && <Component />}
      </PdfExportContext.Provider>
    </Container>
  );
};
