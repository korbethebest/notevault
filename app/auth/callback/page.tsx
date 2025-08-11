"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { createClientSupabaseClient } from "@/libs";

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		const run = async () => {
			try {
				const { error } = await createClientSupabaseClient().auth.exchangeCodeForSession(
					window.location.href,
				);

				if (error) {
					console.error("Auth callback error:", error);
					router.replace(`/login?error=${encodeURIComponent(error.message)}`);
					return;
				}

				router.replace("/");
			} catch (err) {
				console.error("Unexpected error in auth callback:", err);
				router.replace("/login?error=unexpected_error");
			}
		};

		run();
	}, [router]);

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
			<div className="flex items-center gap-3 mb-6">
				<div className="bg-[#1DB954] w-10 h-10 rounded-full flex items-center justify-center">
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
						className="text-black"
					>
						<path d="M9 18V5l12-2v13"></path>
						<circle cx="6" cy="18" r="3"></circle>
						<circle cx="18" cy="16" r="3"></circle>
					</svg>
				</div>
				<h1 className="text-2xl font-bold">NoteVault</h1>
			</div>

			<div className="text-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954] mx-auto mb-4"></div>
				<p className="text-lg">로그인 처리 중입니다...</p>
				<p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요</p>
			</div>
		</div>
	);
}
