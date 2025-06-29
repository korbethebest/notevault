"use client";

import { useModal } from "../model";

const Modal: React.FC = () => {
	const { modal, confirm, cancel } = useModal();
	const { isOpen, title, message, confirmText, cancelText, onCancel, type } = modal;
	if (!isOpen) return null;

	const getIconByType = () => {
		switch (type) {
			case "success":
				return (
					<div className="bg-green-100 rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-green-600"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					</div>
				);
			case "warning":
				return (
					<div className="bg-yellow-100 rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-yellow-600"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
					</div>
				);
			case "error":
				return (
					<div className="bg-red-100 rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-red-600"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="15" y1="9" x2="9" y2="15"></line>
							<line x1="9" y1="9" x2="15" y2="15"></line>
						</svg>
					</div>
				);
			default:
				return (
					<div className="bg-[#1DB95420] rounded-full p-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-[#1DB954]"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="16" x2="12" y2="12"></line>
							<line x1="12" y1="8" x2="12.01" y2="8"></line>
						</svg>
					</div>
				);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
				<div className="flex items-start mb-4">
					{getIconByType()}
					<div className="ml-4 flex-1">
						{title && <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>}
						<p className="text-gray-300">{message}</p>
					</div>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					{onCancel && (
						<button
							onClick={cancel}
							className="px-4 py-2 border border-zinc-700 text-white rounded-md hover:bg-zinc-800 transition-colors"
						>
							{cancelText}
						</button>
					)}
					<button
						onClick={confirm}
						className="px-4 py-2 bg-[#1DB954] text-black rounded-md hover:bg-[#1ed760] transition-colors font-medium"
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
