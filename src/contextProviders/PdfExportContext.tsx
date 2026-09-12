import { createContext } from "react";

interface PdfExportContextType {
    expandAll: boolean;
}

export const PdfExportContext = createContext<PdfExportContextType>({
    expandAll: false,
});
