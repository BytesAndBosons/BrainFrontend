import { createContext } from "react";

// Lets a nested AccordionSection ask every ancestor AccordionSection to open
// itself too, so anchor-linking to a deeply nested section actually reveals it.
export const AccordionAncestryContext = createContext<() => void>(() => { });
