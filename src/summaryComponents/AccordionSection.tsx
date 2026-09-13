import { Accordion } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PdfExportContext } from '../contextProviders/PdfExportContext';
import { AccordionAncestryContext } from '../contextProviders/AccordionAncestryContext';

export const AccordionSection: React.FC<{ title: string | null, children: React.ReactNode, anchor?: string }> = ({ title, children, anchor }) => {
    const location = useLocation();
    const { expandAll } = useContext(PdfExportContext);
    const openAncestors = useContext(AccordionAncestryContext);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    useEffect(() => {
        if (anchor && location.hash === `#${anchor}`) {
            setActiveKey('0');
            // A matching section can be nested inside other, still-collapsed
            // sections; opening only itself would stay invisible, so also
            // open every ancestor up the chain.
            openAncestors();
            setTimeout(() => {
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 400);
        }
    }, [anchor, location]);

    // Force this section open while a PDF export is in progress
    useEffect(() => {
        if (expandAll) {
            setActiveKey('0');
        }
    }, [expandAll]);

    const openSelfAndAncestors = () => {
        setActiveKey('0');
        openAncestors();
    };

    return (
        <AccordionAncestryContext.Provider value={openSelfAndAncestors}>
            <Accordion id={anchor} activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey as string | null)}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>{title}</Accordion.Header>
              <Accordion.Body>
                {children}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </AccordionAncestryContext.Provider>
    )
}