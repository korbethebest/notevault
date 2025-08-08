"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";
import { useAuth } from "@/shared";

function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [nickname, setNickname] = useState<string>("");
	const { user, isLoading, isSignedIn } = useAuth();

	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!user) {
				setNickname("");
				return;
			}

			try {
				const { data, error } = await createClientSupabaseClient()
					.from("User")
					.select("nickname")
					.eq("id", user.id)
					.single();

				if (data && !error && data.nickname) {
					setNickname(data.nickname);
				} else {
					const fallbackNickname =
						user.user_metadata?.nickname || user.email?.split("@")[0] || "사용자";
					setNickname(fallbackNickname);
				}
			} catch (error) {
				console.error("사용자 정보 조회 중 예외 발생:", error);
				const fallbackNickname =
					user.user_metadata?.nickname || user.email?.split("@")[0] || "사용자";
				setNickname(fallbackNickname);
			}
		};

		fetchUserProfile();
	}, [user]);

	const handleLogout = async () => {
		try {
			const { error } = await createClientSupabaseClient().auth.signOut();

			if (error) {
				console.error("로그아웃 오류:", error.message);
				return;
			}

			router.push("/login");
		} catch (error) {
			console.error("로그아웃 처리 중 예외 발생:", error);
		}
	};

	if (pathname === "/login" || pathname === "/signup") {
		return null;
	}

	if (isLoading) {
		return <div className="h-16 bg-black border-b border-zinc-800" />;
	}

	if (isSignedIn === null) {
		return null;
	}

	console.log("Header rendering state:", { isSignedIn, user, nickname });

	return (
		<header className="bg-black text-white border-b border-zinc-800 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* 로고 영역 */}
					<div className="flex items-center">
						<Link href="/" className="flex items-center gap-2">
							<div className="bg-[#1DB954] w-8 h-8 rounded-full flex items-center justify-center">
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
									className="text-black"
								>
									<path d="M9 18V5l12-2v13"></path>
									<circle cx="6" cy="18" r="3"></circle>
									<circle cx="18" cy="16" r="3"></circle>
								</svg>
							</div>
							<span className="text-xl font-bold">NoteVault</span>
						</Link>
					</div>

					{/* 모바일 메뉴 버튼 */}
					<div className="md:hidden">
						<button
							type="button"
							className="text-gray-300 hover:text-white focus:outline-none"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
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
							>
								{isMenuOpen ? (
									<>
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</>
								) : (
									<>
										<line x1="4" y1="12" x2="20" y2="12"></line>
										<line x1="4" y1="6" x2="20" y2="6"></line>
										<line x1="4" y1="18" x2="20" y2="18"></line>
									</>
								)}
							</svg>
						</button>
					</div>

					{/* 데스크탑 메뉴 */}
					<div className="hidden md:flex md:items-center md:space-x-4">
						{nickname && (
							<div className="ml-4 text-sm text-gray-300">
								환영합니다 <span className="text-[#1DB954] font-medium">{nickname}</span>님!
							</div>
						)}
						<Link
							href="/profile"
							className="text-gray-300 hover:text-[#1DB954] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
							프로필
						</Link>
						<button
							onClick={handleLogout}
							className="text-gray-300 hover:text-[#1DB954] px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16 17 21 12 16 7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
							로그아웃
						</button>
					</div>
				</div>
			</div>

			{/* 모바일 메뉴 드롭다운 */}
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-zinc-800">
						<Link
							href="/profile"
							className="text-gray-300 hover:text-[#1DB954] px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</svg>
							프로필
						</Link>
						<button
							onClick={handleLogout}
							className="text-gray-300 hover:text-[#1DB954] px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
								<polyline points="16 17 21 12 16 7"></polyline>
								<line x1="21" y1="12" x2="9" y2="12"></line>
							</svg>
							로그아웃
						</button>
					</div>
				</div>
			)}
		</header>
	);
}

export default Header;
