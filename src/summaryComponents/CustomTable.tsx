import { Table } from "react-bootstrap";
import './styles/CustomTable.css';

export const CustomTable: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <div className="table-container">
            <Table className="custom-table">
                {children}
            </Table>
        </div>
    )

}