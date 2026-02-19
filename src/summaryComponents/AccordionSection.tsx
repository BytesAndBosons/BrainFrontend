import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AccordionSection: React.FC<{ title: string | null, children: React.ReactNode, anchor?: string }> = ({ title, children, anchor }) => {
    const location = useLocation();
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