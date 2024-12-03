"use client";
import React, { useState } from "react";
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
import { useCategory } from "../hooks/category";
import { Category } from "../interface";

const Budget = () => {
	const staticBudgets = [
		{
			id: 1,
			title: "Household Essentials",
			amount: 500,
			startDate: "2024-12-01",
			endDate: "2024-12-31",
			categorySpecified: "Yes",
			categories: [
				{ category: "Food", amount: 300 },
				{ category: "Transportation", amount: 100 },
				{ category: "Utilities", amount: 100 },
			],
		},
		{
			id: 2,
			title: "Transportation",
			amount: 200,
			startDate: "2024-11-01",
			endDate: "2024-11-30",
			categorySpecified: "Yes",
			categories: [
				{ category: "Other", amount: 120 },
				{ category: "Rent", amount: 50 },
				{ category: "Food", amount: 30 },
			],
		},
		{
			id: 3,
			title: "Entertainment and Leisure",
			amount: 300,
			startDate: "2024-10-01",
			endDate: "2024-10-31",
			categorySpecified: "No",
			categories: [],
		},
	];

	const [data, setData] = useState(staticBudgets);
	const isLoading = useIsMutating();
	const [open, setOpen] = useState(false);
	const [edit, setEdit] = useState(false);
	const [formData, setFormData] = useState({} as any);
	const [categoryBudgets, setCategoryBudgets] = useState([
		{ category: "", amount: "" },
	]);
	const { mutate } = useCreateBudget();
	const { mutate: mutateDelete } = useDeleteBudget();
	const { mutate: update, isSuccess: isUpdateSuccess } = useUpdateBudget();

	console.log({ data });
	console.log({ categoryBudgets });
	if (isUpdateSuccess) {
		setFormData({});
		setOpen(false);
	}

	const openHandler = () => {
		setOpen(!open);
		setEdit(false);
		setFormData({});
		setCategoryBudgets([{ category: "", amount: "" }]);
	};

	const actions = (item) => [
		{
			name: "Edit",
			onClick: (res: any) => {
				setFormData(res);
				setCategoryBudgets(res?.categories || [{ category: "", amount: "" }]);
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
						setData(data.filter((item) => item.id !== res.id));
					}
				});
			},
		},
	];

	const columns = [
		{ title: "Title", field: "title" },
		{ title: "Amount", field: "amount" },
		{ title: "Category Specified", field: "categorySpecified" },
		{ title: "Start Date", field: "startDate" },
		{ title: "End Date", field: "endDate" },
	];

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleCategoryChange = (
		index: number,
		field: string,
		value: string,
	) => {
		const updatedCategoryBudgets = [...categoryBudgets];
		updatedCategoryBudgets[index][field] = value;
		setCategoryBudgets(updatedCategoryBudgets);
	};

	const handleCategorySpecifiedChange = (value: string) => {
		setFormData({
			...formData,
			categorySpecified: value,
		});
	};

	const addCategoryBudget = () => {
		setCategoryBudgets([...categoryBudgets, { category: "", amount: "" }]);
	};

	const removeCategoryBudget = (index: number) => {
		const updatedCategoryBudgets = categoryBudgets.filter(
			(_, i) => i !== index,
		);
		setCategoryBudgets(updatedCategoryBudgets);
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
				buttons: "OK",
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
					// Prepare the new budget object
					const newBudget = {
						...formData,
						id: data.length + 1,
						categories:
							formData.categorySpecified === "Yes"
								? categoryBudgets.map((cat) => ({
										category: cat.category,
										amount: Number(cat.amount),
								  }))
								: [],
					};

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
				text: "Cannot edit a budget with dates that overlap with an existing budget.",
				icon: "error",
				buttons: "OK",
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
					// Prepare the updated budget object
					const updatedBudget = {
						...formData,
						categories:
							formData.categorySpecified === "Yes"
								? categoryBudgets.map((cat) => ({
										category: cat.category,
										amount: Number(cat.amount),
								  }))
								: [],
					};

					// Update the budget list
					const updatedData = data.map((item) =>
						item.id === formData.id ? updatedBudget : item,
					);
					setData(updatedData);
					setEdit(false);
					setOpen(false);
					setCategoryBudgets([{ category: "", amount: "" }]);
				}
			});
		}
	};

	const categories: Category[] = useCategory();

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
								name='title'
								placeholder='Budget Title'
								value={formData?.title}
								onChange={handleChange}
							/>
							<FormInput
								type='number'
								name='amount'
								placeholder='Total Budget Amount'
								value={formData.amount || ""}
								onChange={handleChange}
							/>
							<div className={style.radio}>
								<label>
									Do you want to create budgets for specific categories?
								</label>
								<input
									type='radio'
									name='categorySpecified'
									value='Yes'
									checked={formData.categorySpecified === "Yes"}
									onChange={() => handleCategorySpecifiedChange("Yes")}
								/>
								Yes
								<input
									type='radio'
									name='categorySpecified'
									value='No'
									checked={formData.categorySpecified === "No"}
									onChange={() => handleCategorySpecifiedChange("No")}
								/>
								No
							</div>
							{formData?.categorySpecified === "Yes" &&
								categoryBudgets?.map((cat, index) => {
									return (
										<div key={index}>
											<select
												name='category'
												value={cat?.category}
												onChange={(e) =>
													handleCategoryChange(
														index,
														"category",
														e.target.value,
													)
												}
												style={{
													padding: "0.5rem",
													border: "none",
													outline: "none",
													borderBottom: "1px solid #d0d0d0",
													fontSize: "14px",
													width: "100%",
												}}>
												<option value=''>Select Category</option>
												{categories?.map((cat, i) => (
													<option
														key={i}
														value={cat?.name}>
														{cat?.name}
													</option>
												))}
											</select>
											<FormInput
												type='number'
												name='amount'
												placeholder='Budget Amount'
												value={cat.amount || ""}
												onChange={(e) =>
													handleCategoryChange(index, "amount", e.target.value)
												}
											/>
											<button
												type='button'
												onClick={() => removeCategoryBudget(index)}
												style={{
													background: "rgba(200, 0, 22, 1)",
													color: "#fff",
													border: "none",
													padding: "0.3rem 0.5rem",
													fontSize: "12px",
													marginTop: "0.5rem",
													cursor: "pointer",
													borderRadius: "5px",
												}}>
												Remove
											</button>
										</div>
									);
								})}

							{formData?.categorySpecified === "Yes" && (
								<button
									type='button'
									onClick={addCategoryBudget}
									style={{
										background: "#007bff",
										color: "#fff",
										border: "none",
										padding: "0.5rem 1rem",
										fontSize: "14px",
										marginTop: "1rem",
										cursor: "pointer",
										width: "fit-content",
									}}>
									Add Category Budget
								</button>
							)}
							<div className={style.dateGroup}>
								<div>
									<p>Budget Start Date</p>
									<FormInput
										type='date'
										name='startDate'
										placeholder='Start Date'
										value={formData?.startDate || ""}
										onChange={handleChange}
									/>
								</div>
								<div>
									<p>Budget End Date</p>
									<FormInput
										type='date'
										name='endDate'
										placeholder='End Date'
										value={formData?.endDate || ""}
										onChange={handleChange}
									/>
								</div>
							</div>
							<button
								type='submit'
								style={{
									background: edit ? "#ffc107" : "#28a745",
									color: "#fff",
									border: "none",
									padding: "0.7rem 1.5rem",
									fontSize: "16px",
									marginTop: "1rem",
									cursor: "pointer",
									width: "100%",
								}}>
								{edit ? "Update Budget" : "Submit Budget"}
							</button>
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
