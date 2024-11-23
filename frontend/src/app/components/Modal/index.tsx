import React from "react";
import "./index.css";
import { ModalProps } from "../../interface";
import { MdCancel } from "react-icons/md";

const Modal: React.FC<ModalProps> = ({
	isVisible,
	title,
	size,
	content,
	onClose,
	footer,
}) => {
	if (!isVisible) return null;

	return (
		<div className='modal-component'>
			<div className={`modal-container ${size}`}>
				<div className='modal-header'>
					<h2>{title}</h2>
					<div
						className='close-button'
						onClick={onClose}>
						<MdCancel />
					</div>
				</div>
				<div className='modal-content'>{content}</div>
				{footer && <div className='modal-footer'>{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
