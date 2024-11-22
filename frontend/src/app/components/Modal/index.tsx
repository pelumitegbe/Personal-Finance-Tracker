import React from "react";
import "./index.css";
import { ModalProps } from "../../interface";

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
		<div className='modal-overlay'>
			<div className={`modal-container ${size}`}>
				<div className='modal-header'>
					<h2>{title}</h2>
					<button
						className='close-button'
						onClick={onClose}>
						&times;
					</button>
				</div>
				<div className='modal-content'>{content}</div>
				{footer && <div className='modal-footer'>{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
