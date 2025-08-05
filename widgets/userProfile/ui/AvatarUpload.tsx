"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type AvatarUploadProps = {
	currentAvatarUrl?: string;
	userId: string;
	nickname: string;
	onAvatarUpdate: (newAvatarUrl: string | null) => void;
};

function AvatarUpload({ currentAvatarUrl, userId, nickname, onAvatarUpdate }: AvatarUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [imageError, setImageError] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			alert("이미지 파일만 업로드할 수 있습니다.");
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("파일 크기는 5MB 이하여야 합니다.");
			return;
		}

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("avatar", file);
			formData.append("userId", userId);

			const response = await fetch("/api/profile/avatar", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (response.ok && result.success) {
				onAvatarUpdate(result.avatar_url);
				setImageError(false);
			} else {
				alert(result.error || "아바타 업로드에 실패했습니다.");
			}
		} catch (error) {
			console.error("Avatar upload error:", error);
			alert("아바타 업로드 중 오류가 발생했습니다.");
		} finally {
			setIsUploading(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleRemoveAvatar = async () => {
		if (!currentAvatarUrl) return;

		const confirmed = confirm("아바타를 삭제하시겠습니까?");
		if (!confirmed) return;

		setIsUploading(true);

		try {
			const response = await fetch(`/api/profile/avatar?userId=${userId}`, {
				method: "DELETE",
			});

			const result = await response.json();

			if (response.ok && result.success) {
				onAvatarUpdate(null);
				setImageError(false);
			} else {
				alert(result.error || "아바타 삭제에 실패했습니다.");
			}
		} catch (error) {
			console.error("Avatar delete error:", error);
			alert("아바타 삭제 중 오류가 발생했습니다.");
		} finally {
			setIsUploading(false);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex flex-col items-center">
			{/* Avatar Display */}
			<div className="relative group w-24 h-24 cursor-pointer" onClick={triggerFileInput}>
				{!imageError && currentAvatarUrl ? (
					<Image
						src={currentAvatarUrl}
						alt={nickname}
						width={96}
						height={96}
						className="w-full h-full object-cover rounded-full"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="w-full h-full bg-zinc-700 rounded-full flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-zinc-400"
						>
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</div>
				)}

				{/* Upload Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
					{isUploading ? (
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
					) : (
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
							className="text-white"
						>
							<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
							<circle cx="12" cy="13" r="3" />
						</svg>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="mt-3 flex gap-2">
				<button
					onClick={triggerFileInput}
					disabled={isUploading}
					className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-sm px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17,8 12,3 7,8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					{currentAvatarUrl ? "변경" : "업로드"}
				</button>

				{currentAvatarUrl && (
					<button
						onClick={handleRemoveAvatar}
						disabled={isUploading}
						className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white text-sm px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="3,6 5,6 21,6" />
							<path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
						</svg>
						삭제
					</button>
				)}
			</div>

			{/* Hidden File Input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Upload Instructions */}
			<p className="text-xs text-zinc-500 mt-2">JPG, PNG, GIF 파일 (최대 5MB)</p>
		</div>
	);
}

export default AvatarUpload;
