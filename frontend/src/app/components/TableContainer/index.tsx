import * as React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./index.css";

interface Column {
	field: string;
	title: string;
}

interface Action {
	name: string;
	onClick: (item: any) => void; // Action handler
}

interface TableProps {
	data: any[];
	columns: Column[];
	actions?: (item: any) => Action[]; // Actions to perform on each row
}

const TableContainer: React.FC<TableProps> = ({ data, columns, actions }) => {
	return (
		<div className='customTable'>
			<table>
				<thead>
					<tr>
						<th>S/N</th>
						{columns?.map((column) => (
							<th key={column?.field}>{column?.title}</th>
						))}
						{actions && <th>Actions</th>}
					</tr>
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							{columns?.map((column) => (
								<td key={column?.field}>{item[column?.field]}</td>
							))}
							{actions && (
								<td>
									{actions(item)?.map((action, actionIndex) => (
										<button
											key={actionIndex}
											onClick={() => action.onClick(item)}
											className='actionButton'
											title={action.name}
											style={{
												marginRight: "8px",
												border: "none",
												background: "transparent",
											}}>
											{action.name === "Edit" && (
												<FaEdit style={{ color: "blue", cursor: "pointer" }} />
											)}
											{action.name === "Delete" && (
												<FaTrash style={{ color: "red", cursor: "pointer" }} />
											)}
										</button>
									))}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableContainer;
