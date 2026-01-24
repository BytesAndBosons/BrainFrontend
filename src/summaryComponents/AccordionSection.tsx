import { Accordion } from 'react-bootstrap';

export const AccordionSection: React.FC<{ title: string | null, children: React.ReactNode }> = ({ title, children }) => {

    return (
        <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{title}</Accordion.Header>
          <Accordion.Body>
            {children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
}