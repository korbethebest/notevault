"use client";

import { useWikiList } from "../hooks";
import WikiCard from "./WikiCard";

export default function WikiList() {
	const { wikis, loading, error, loadMore, hasMore } = useWikiList();

	if (loading && wikis.length === 0) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold mb-2">🎵 음악 위키</h1>
						<p className="text-zinc-400">사용자들이 작성한 음악 위키를 둘러보세요</p>
					</div>

					{/* 로딩 스켈레톤 */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
						{Array.from({ length: 20 }, (_, i) => (
							<div key={i} className="bg-zinc-900 rounded-xl p-4 animate-pulse">
								<div className="aspect-square bg-zinc-700 rounded-lg mb-4"></div>
								<div className="space-y-2 mb-3">
									<div className="h-4 bg-zinc-700 rounded w-3/4"></div>
									<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
									<div className="h-3 bg-zinc-700 rounded w-2/3"></div>
								</div>
								<div className="border-t border-zinc-700 pt-3 space-y-2">
									<div className="h-3 bg-zinc-700 rounded w-full"></div>
									<div className="h-3 bg-zinc-700 rounded w-4/5"></div>
									<div className="h-3 bg-zinc-700 rounded w-3/5"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-2">🎵 음악 위키</h1>
						<div className="bg-red-900/20 border border-red-800 p-6 rounded-xl max-w-md mx-auto">
							<h3 className="text-xl font-semibold mb-2 text-red-400">위키를 불러올 수 없습니다</h3>
							<p className="text-red-300 text-sm">{error}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (wikis.length === 0) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-2">🎵 음악 위키</h1>
						<p className="text-zinc-400 mb-8">사용자들이 작성한 음악 위키를 둘러보세요</p>
						<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md mx-auto">
							<div className="text-6xl mb-4">📝</div>
							<h3 className="text-xl font-semibold mb-2 text-zinc-300">
								아직 작성된 위키가 없습니다
							</h3>
							<p className="text-zinc-500 text-sm">첫 번째 음악 위키를 작성해보세요!</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">🎵 음악 위키</h1>
					<p className="text-zinc-400">사용자들이 작성한 음악 위키를 둘러보세요</p>
					<p className="text-zinc-500 text-sm mt-2">총 {wikis.length}개의 위키</p>
				</div>

				{/* Wiki 그리드 */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{wikis.map((wiki) => (
						<WikiCard key={wiki.id} wiki={wiki} />
					))}
				</div>

				{/* 더 보기 버튼 */}
				{hasMore && (
					<div className="text-center mt-12">
						<button
							onClick={loadMore}
							disabled={loading}
							className="bg-[#1DB954] text-black px-8 py-3 rounded-full font-medium hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "로딩 중..." : "더 보기"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
