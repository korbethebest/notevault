"use client";

import { createContext, type ReactNode, useCallback, useState } from "react";

export type ModalOptions = {
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	type?: "info" | "success" | "warning" | "error";
};

export type ModalState = ModalOptions & {
	isOpen: boolean;
};

export type ModalContextType = {
	modal: ModalState;
	openModal: (options: ModalOptions) => void;
	closeModal: () => void;
	confirm: () => void;
	cancel: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

const defaultOptions: ModalOptions = {
	title: "",
	message: "",
	confirmText: "확인",
	cancelText: "취소",
	type: "info",
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
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

	const value = {
		modal,
		openModal,
		closeModal,
		confirm,
		cancel,
	};

	return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
