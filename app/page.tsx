import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[40px] items-center max-w-3xl w-full text-center">
				<div className="flex flex-col items-center gap-4">
					<div className="flex items-center gap-3">
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
						<h1 className="text-3xl sm:text-4xl font-bold">NoteVault</h1>
					</div>
					<p className="text-xl text-gray-300 max-w-lg">
						음악에 대한 당신의 생각을 기록하고 공유하세요
					</p>
				</div>

				<div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full">
					<h2 className="text-xl font-semibold mb-4">NoteVault에서 할 수 있는 것</h2>
					<ul className="list-inside space-y-3 text-left">
						<li className="flex items-start gap-3">
							<div className="bg-[#1DB954] p-1 rounded-md mt-0.5">
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
									className="text-black"
								>
									<path d="M9 18V5l12-2v13"></path>
									<circle cx="6" cy="18" r="3"></circle>
									<circle cx="18" cy="16" r="3"></circle>
								</svg>
							</div>
							<span>좋아하는 곡에 대한 생각과 감상을 기록하세요</span>
						</li>
						<li className="flex items-start gap-3">
							<div className="bg-[#1DB954] p-1 rounded-md mt-0.5">
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
									className="text-black"
								>
									<path d="M21 15V6"></path>
									<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path>
									<path d="M12 12H3"></path>
									<path d="M16 6H3"></path>
									<path d="M12 18H3"></path>
								</svg>
							</div>
							<span>다른 음악 애호가들과 의견을 나누고 토론하세요</span>
						</li>
						<li className="flex items-start gap-3">
							<div className="bg-[#1DB954] p-1 rounded-md mt-0.5">
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
									className="text-black"
								>
									<circle cx="12" cy="12" r="10"></circle>
									<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
									<path d="M12 17h.01"></path>
								</svg>
							</div>
							<span>곡의 가사와 배경 이야기를 탐색하세요</span>
						</li>
					</ul>
				</div>

				<div className="flex gap-4 items-center flex-col sm:flex-row w-full">
					<Link
						className="rounded-md transition-colors flex items-center justify-center bg-[#1DB954] text-black gap-2 hover:bg-[#1ed760] font-medium text-sm sm:text-base h-12 px-6 w-full sm:w-auto"
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
							<path d="m9 18 6-6-6-6"></path>
						</svg>
						노래 둘러보기
					</Link>
					<Link
						className="rounded-md border border-solid border-zinc-700 transition-colors flex items-center justify-center hover:bg-zinc-800 font-medium text-sm sm:text-base h-12 px-6 w-full sm:w-auto"
						href="/about"
					>
						NoteVault 소개
					</Link>
				</div>
			</main>
			<footer className="mt-16 flex gap-[24px] flex-wrap items-center justify-center text-zinc-400">
				<Link
					className="flex items-center gap-2 hover:text-[#1DB954] transition-colors"
					href="/songs"
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
						<path d="M9 18V5l12-2v13"></path>
						<circle cx="6" cy="18" r="3"></circle>
						<circle cx="18" cy="16" r="3"></circle>
					</svg>
					노래 목록
				</Link>
				<Link
					className="flex items-center gap-2 hover:text-[#1DB954] transition-colors"
					href="/wiki"
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
						<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
						<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
					</svg>
					위키
				</Link>
				<Link
					className="flex items-center gap-2 hover:text-[#1DB954] transition-colors"
					href="/community"
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
						<path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
						<path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
					</svg>
					커뮤니티
				</Link>
			</footer>
		</div>
	);
}
