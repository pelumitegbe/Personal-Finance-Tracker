"use client";
import React from "react";
import TableContainer from "../components/TableContainer";
import style from "./index.module.css";
import Layout from "../layout/index";
import Modal from "../components/Modal";
import { useIsMutating } from "@tanstack/react-query";
import {
	useCreateBudget,
	useDeleteBudget,
	useUpdateBudget,
} from "../hooks/budget";
import FormInput from "../components/FormInput";
import swal from "sweetalert";

const Budget = () => {
	const staticBudgets = [
		{
			id: 1,
			name: "Groceries",
			amount: 200,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
		{
			id: 2,
			name: "Transport",
			amount: 100,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
		{
			id: 3,
			name: "Entertainment",
			amount: 150,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
		},
	];

	const [data, setData] = React.useState(staticBudgets);
	const isLoading = useIsMutating();
	const [open, setOpen] = React.useState(false);
	const [edit, setEdit] = React.useState(false);
	const [formData, setFormData] = React.useState({} as any);

	const { mutate } = useCreateBudget();
	const { mutate: mutateDelete } = useDeleteBudget();
	const { mutate: update, isSuccess: isUpdateSuccess } = useUpdateBudget();

	console.log({ data });
	if (isUpdateSuccess) {
		setFormData({});
		setOpen(false);
	}

	const openHandler = () => {
		setOpen(!open);
		setEdit(false);
		setFormData({});
	};

	const actions = (item) => [
		{
			name: "Edit",
			onClick: (res: any) => {
				setFormData(res);
				setEdit(true);
				setOpen(true);
			},
		},
		{
			name: "Delete",
			onClick: (res: any) => {
				swal({
					title: "Are you sure?",
					text: "Once deleted, you will not be able to recover this",
					icon: "warning",
					buttons: ["Cancel", "Submit"],
					dangerMode: true,
				}).then((willDelete) => {
					if (willDelete) {
						// mutateDelete(res.id);
						setData(data.filter((item) => item.id !== res.id));
					}
				});
			},
		},
	];

	const columns = [
		{ title: "Name", field: "name" },
		{ title: "Amount", field: "amount" },
		{ title: "Start Date", field: "startDate" },
		{ title: "End Date", field: "endDate" },
	];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const startDate = new Date(formData.startDate);
		const endDate = new Date(formData.endDate);

		// Check for overlapping budgets
		const isOverlapping = data.some((budget) => {
			const existingStart = new Date(budget.startDate);
			const existingEnd = new Date(budget.endDate);
			return startDate <= existingEnd && endDate >= existingStart;
		});

		if (isOverlapping) {
			swal({
				title: "Error",
				text: "Cannot create a budget that overlaps with an existing budget.",
				icon: "error",
				buttons: ["OK"],
			});
		} else {
			swal({
				title: "Confirmation",
				text: "Are you sure you want to submit this?",
				icon: "warning",
				buttons: ["Cancel", "Submit"],
				dangerMode: true,
			}).then((willSubmit) => {
				if (willSubmit) {
					const newBudget = { ...formData, id: data.length + 1 };
					setData([...data, newBudget]);
					setOpen(false);
				}
			});
		}
	};

	const updateHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const startDate = new Date(formData.startDate);
		const endDate = new Date(formData.endDate);

		// Check for overlapping budgets, ignoring the current one being edited
		const isOverlapping = data.some((budget) => {
			if (budget.id === formData.id) return false;
			const existingStart = new Date(budget.startDate);
			const existingEnd = new Date(budget.endDate);
			return startDate <= existingEnd && endDate >= existingStart;
		});

		if (isOverlapping) {
			swal({
				title: "Error",
				text: "Cannot edit a budget with dates that overlaps with an existing budget.",
				icon: "error",
				buttons: ["OK"],
			});
		} else {
			swal({
				title: "Confirmation",
				text: "Are you sure you want to edit this?",
				icon: "warning",
				buttons: ["Cancel", "Submit"],
				dangerMode: true,
			}).then((willSubmit) => {
				if (willSubmit) {
					const updatedData = data.map((item) =>
						item.id === formData.id ? formData : item,
					);
					setData(updatedData);
					setEdit(false);
					setOpen(false);
				}
			});
		}
	};

	return (
		<Layout
			name='Budget'
			pageTitle='Manage Budget'>
			<div className={style.budget}>
				<button
					className={style.btn}
					type='button'
					onClick={openHandler}>
					Add Budget
				</button>

				<TableContainer
					data={data}
					columns={columns}
					actions={actions}
				/>

				<Modal
					isVisible={open}
					title={edit ? "Edit Budget" : "Add Budget"}
					size='md'
					content={
						<form onSubmit={edit ? updateHandler : handleSubmit}>
							<FormInput
								type='text'
								name='name'
								placeholder='Name'
								value={formData?.name}
								onChange={handleChange}
							/>
							<FormInput
								type='number'
								name='amount'
								placeholder='Amount'
								value={formData.amount || ""}
								onChange={handleChange}
							/>
							<FormInput
								type='date'
								name='startDate'
								placeholder='Start Date'
								value={formData.startDate || ""}
								onChange={handleChange}
							/>
							<FormInput
								type='date'
								name='endDate'
								placeholder='End Date'
								value={formData.endDate || ""}
								onChange={handleChange}
							/>
							<button type='submit'>Submit</button>
						</form>
					}
					onClose={() => setOpen(false)}
					footer=''
				/>
			</div>
		</Layout>
	);
};

export default Budget;
