import * as React from "react";
import "./index.css";

interface Column {
  field: string; // Field name that matches a key in the data objects
  title: string; // Title to display in the table header
}

interface TableProps {
  data: Array<{ [key: string]: any }>;
  columns: Column[];
}

const TableContainer: React.FC<TableProps> = ({
  data,
  columns,
}) => {

  return (
    <div className="customTable">
      <table>
        <thead>
          <th>S/N</th>
          {columns?.map((column) => (
            <th key={column?.field}>{column?.title}</th>
          ))}
          {/* <th>Action</th> */}
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {columns?.map((column) => (
                <td key={column?.field}>{item[column?.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContainer;
