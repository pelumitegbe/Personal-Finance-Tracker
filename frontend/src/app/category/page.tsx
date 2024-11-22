import React from "react";
import TableContainer from "../components/TableContainer";
import style from "./index.module.css";
import { FormInput } from "lucide-react";
import Layout from "../layout/index";
import Modal from "../components/Modal";
import { useIsMutating } from "@tanstack/react-query";
import {
	useCategory,
	useCreateCategory,
	useDeleteCategory,
	useUpdateCategory,
} from "../hooks/category";

const Category = () => {
	const data = useCategory();
	const isLoading = useIsMutating();
	const [open, setOpen] = React.useState(false);
	const [edit, setEdit] = React.useState(false);
	const [formData, setFormData] = React.useState({} as any);

	const { mutate } = useCreateCategory();
	const { mutate: mutateDelete } = useDeleteCategory();
	const { mutate: update, isSuccess: isUpdateSuccess } = useUpdateCategory();

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
						mutateDelete(res.id);
					}
				});
			},
		},
	];

	const columns = [{ title: "Title", field: "Title" }];

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		swal({
			title: "Confirmation",
			text: "Are you sure you want to submit this?",
			icon: "warning",
			buttons: ["Cancel", "Submit"],
			dangerMode: true,
		}).then((willSubmit) => {
			if (willSubmit) {
				mutate(formData);
			}
		});
	};

	const updateHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		swal({
			title: "Confirmation",
			text: "Are you sure you want to edit this?",
			icon: "warning",
			buttons: ["Cancel", "Submit"],
			dangerMode: true,
		}).then((willSubmit) => {
			if (willSubmit) {
				update(formData);
			}
		});
	};
	return (
		<Layout
			name='Category'
			pageTitle='Category'>
			<div className={style.account}>
				<div className='btnContainer'>
					<button
						className='btn btnYellow'
						type='button'
						onClick={openHandler}>
						Add Category
					</button>
				</div>

				<TableContainer
					data={data}
					columns={columns}
					actions={actions}
				/>

				<Modal
					isVisible={open}
					title={edit ? "Edit" : "Add"}
					size='lg'
					content={
						<>
							<form onSubmit={edit ? updateHandler : handleSubmit}>
								<FormInput
									type='text'
									name='name'
									placeholder='Name'
									value={formData?.name}
									onChange={handleChange}
								/>
								<button type='submit'>Submit</button>
							</form>
						</>
					}
					onClose={() => setOpen(false)}
					footer=''
				/>
			</div>
		</Layout>
	);
};

export default Category;
