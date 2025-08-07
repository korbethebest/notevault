"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HelperIcons() {
	const pathname = usePathname();

	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

	return (
		<div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
			<div className="relative group">
				<Link
					className="w-12 h-12 bg-zinc-800 hover:bg-[#1DB954] text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
					href="/songs"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M9 18V5l12-2v13"></path>
						<circle cx="6" cy="18" r="3"></circle>
						<circle cx="18" cy="16" r="3"></circle>
					</svg>
				</Link>
				<div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
					노래 목록
					<div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-zinc-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
				</div>
			</div>

			<div className="relative group">
				<Link
					className="w-12 h-12 bg-zinc-800 hover:bg-[#1DB954] text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
					href="/wiki"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
						<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
					</svg>
				</Link>
				<div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
					위키
					<div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-zinc-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
				</div>
			</div>

			<div className="relative group">
				<Link
					className="w-12 h-12 bg-zinc-800 hover:bg-[#1DB954] text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
					href="/community"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
						<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
					</svg>
				</Link>
				<div className="absolute right-14 top-1/2 -translate-y-1/2 bg-zinc-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
					커뮤니티
					<div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-zinc-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
				</div>
			</div>
		</div>
	);
}

export default HelperIcons;
