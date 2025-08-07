import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* 헤더 섹션 */}
				<div className="text-center mb-20">
					<h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
						NoteVault
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
						음악을 사랑하는 모든 이들을 위한 공간
					</p>
				</div>

				{/* 소개 섹션 */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-6 text-green-500">NoteVault란?</h2>
						<p className="text-gray-300 mb-4">
							NoteVault는 음악 애호가들이 자신이 좋아하는 곡을 발견하고, 공유하고, <br />
							토론할 수 있는 온라인 커뮤니티입니다.
						</p>
						<p className="text-gray-300 mb-4">
							전 세계 차트를 확인하고, 새로운 음악을 발견하며, 다른 음악 애호가들과 소통하세요.
							NoteVault는 여러분의 음악 경험을 한층 더 풍요롭게 만들어 드립니다.
						</p>
						<p className="text-gray-300">
							음악은 언어의 장벽을 넘어 우리를 하나로 연결합니다. <br />
							NoteVault와 함께 여러분만의 음악 세계를 확장해 보세요.
						</p>
					</div>
					<div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
						<div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-green-900 opacity-70 z-10"></div>
					</div>
				</div>

				{/* 기능 섹션 */}
				<div className="mb-24">
					<h2 className="text-3xl font-bold mb-12 text-center text-green-500">주요 기능</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* 기능 1 */}
						<div className="bg-gray-900 p-6 rounded-lg shadow-lg">
							<div className="text-green-500 text-4xl mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">글로벌 음악 차트</h3>
							<p className="text-gray-400">
								Spotify의 글로벌 및 한국 차트를 실시간으로 확인하고 최신 트렌드를 파악하세요.
							</p>
						</div>

						{/* 기능 2 */}
						<div className="bg-gray-900 p-6 rounded-lg shadow-lg">
							<div className="text-green-500 text-4xl mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">커뮤니티 토론</h3>
							<p className="text-gray-400">
								다른 음악 애호가들과 의견을 나누고, 새로운 음악에 대한 토론에 참여하세요.
							</p>
						</div>

						{/* 기능 3 */}
						<div className="bg-gray-900 p-6 rounded-lg shadow-lg">
							<div className="text-green-500 text-4xl mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
									/>
								</svg>
							</div>
							<h3 className="text-xl font-bold mb-2">개인화된 프로필</h3>
							<p className="text-gray-400">
								자신만의 프로필을 꾸미고, 좋아하는 음악을 저장하여 개인 컬렉션을 만들어보세요.
							</p>
						</div>
					</div>
				</div>

				{/* 비전 섹션 */}
				<div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl mb-24">
					<h2 className="text-3xl font-bold mb-6 text-green-500">우리의 비전</h2>
					<p className="text-gray-300 text-lg mb-4">
						NoteVault는 음악을 통해 사람들을 연결하고, 새로운 음악적 경험을 제공하는 것을 목표로
						합니다.
					</p>
					<p className="text-gray-300 text-lg">
						우리는 모든 음악 장르와 아티스트를 존중하며, 다양한 음악적 취향을 가진 사람들이 함께
						어울릴 수 있는 포용적인 커뮤니티를 만들어 나가고 있습니다.
					</p>
				</div>

				{/* CTA 섹션 */}
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold mb-6">지금 바로 시작하세요</h2>
					<p className="text-gray-300 mb-8 max-w-2xl mx-auto">
						NoteVault와 함께 음악의 세계를 탐험하고, 새로운 음악적 경험을 발견하세요.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Link
							href="/"
							className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
						>
							홈으로 가기
						</Link>
						<Link
							href="/community"
							className="bg-transparent hover:bg-green-800 text-green-500 font-bold py-3 px-8 border border-green-500 rounded-full hover:text-white transition duration-300"
						>
							커뮤니티 둘러보기
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
