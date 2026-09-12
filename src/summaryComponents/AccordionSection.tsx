import { Accordion } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PdfExportContext } from '../contextProviders/PdfExportContext';

export const AccordionSection: React.FC<{ title: string | null, children: React.ReactNode, anchor?: string }> = ({ title, children, anchor }) => {
    const location = useLocation();
    const { expandAll } = useContext(PdfExportContext);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    useEffect(() => {
        if (anchor && location.hash === `#${anchor}`) {
            setActiveKey('0');
            setTimeout(() => {
                const element = document.getElementById(anchor);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }, [anchor, location]);

    // Force this section open while a PDF export is in progress
    useEffect(() => {
        if (expandAll) {
            setActiveKey('0');
        }
    }, [expandAll]);

    return (
        <Accordion id={anchor} activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey as string | null)}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Body>
            {children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
}