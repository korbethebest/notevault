"use client";

import Link from "next/link";

function CreatePostButton() {
	return (
		<Link
			href="/community/create"
			className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white text-sm sm:text-base font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				className="sm:w-5 sm:h-5"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M5 12h14" />
				<path d="M12 5v14" />
			</svg>
			새 게시글 작성
		</Link>
	);
}

export default CreatePostButton;
