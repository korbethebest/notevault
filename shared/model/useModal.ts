"use client";

import { useCallback, useState } from "react";

type ModalOptions = {
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	type?: "info" | "success" | "warning" | "error";
};

type ModalState = ModalOptions & {
	isOpen: boolean;
};

const defaultOptions: ModalOptions = {
	title: "",
	message: "",
	confirmText: "확인",
	cancelText: "취소",
	type: "info",
};

function useModal() {
	const [modal, setModal] = useState<ModalState>({
		...defaultOptions,
		isOpen: false,
	});

	const openModal = useCallback((options: ModalOptions) => {
		setModal({
			...defaultOptions,
			...options,
			isOpen: true,
		});
	}, []);

	const closeModal = useCallback(() => {
		setModal((prev) => ({ ...prev, isOpen: false }));
	}, []);

	const confirm = useCallback(() => {
		if (modal.onConfirm) {
			modal.onConfirm();
		}
		closeModal();
	}, [modal, closeModal]);

	const cancel = useCallback(() => {
		if (modal.onCancel) {
			modal.onCancel();
		}
		closeModal();
	}, [modal, closeModal]);

	return {
		modal,
		openModal,
		closeModal,
		confirm,
		cancel,
	};
}

export default useModal;
