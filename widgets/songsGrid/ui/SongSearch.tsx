"use client";

import { useState } from "react";

import { LoadingSkeleton, SongCard } from "@/entities/track";
import { FavoriteButton } from "@/features/favorites";
import { useSpotifySearch } from "../hooks";

function SongSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const { searchResults, loading, error, lastQuery, searchTracks } = useSpotifySearch();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			searchTracks(searchQuery);
		}
	};

	const handleClear = () => {
		setSearchQuery("");
	};

	return (
		<div className="bg-black text-white p-8">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* 검색 헤더 */}
				<div className="text-center">
					<h2 className="text-3xl font-bold mb-4">🔍 음악 검색</h2>
					<p className="text-zinc-400 mb-6">좋아하는 음악을 검색해보세요</p>

					{/* 검색 폼 */}
					<form onSubmit={handleSearch} className="max-w-2xl mx-auto">
						<div className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="예: BTS, 아이유, 사랑노래..."
								className="w-full px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:border-[#1DB954] focus:ring-2 focus:ring-[#1DB954]/20 transition-colors"
								disabled={loading}
							/>
							<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
								{searchQuery && (
									<button
										type="button"
										onClick={handleClear}
										className="text-zinc-400 hover:text-white transition-colors p-1"
										title="지우기"
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
											<path d="M18 6L6 18M6 6l12 12" />
										</svg>
									</button>
								)}
								<button
									type="submit"
									disabled={loading || !searchQuery.trim()}
									className="bg-[#1DB954] text-black px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
								>
									{loading ? (
										<>
											<svg
												className="animate-spin h-4 w-4"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											검색 중...
										</>
									) : (
										<>
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
												<circle cx="11" cy="11" r="8" />
												<path d="M21 21l-4.35-4.35" />
											</svg>
											검색
										</>
									)}
								</button>
							</div>
						</div>
					</form>
				</div>

				{/* 에러 메시지 */}
				{error && (
					<div className="bg-red-900/20 border border-red-800 p-4 rounded-xl text-center">
						<p className="text-red-300">{error}</p>
					</div>
				)}

				{/* 검색 결과 */}
				{(searchResults.length > 0 || loading) && (
					<div>
						{lastQuery && !loading && (
							<div className="text-center mb-6">
								<h3 className="text-xl font-semibold mb-2">"{lastQuery}"에 대한 검색 결과</h3>
								<p className="text-zinc-400">상위 {searchResults.length}개 결과</p>
							</div>
						)}

						{/* 검색 결과 그리드 */}
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{loading
								? Array.from({ length: 10 }, (_, i) => `search-loading-${i}-${Date.now()}`).map(
										(key) => <LoadingSkeleton key={key} />,
									)
								: searchResults.map((track, index) => (
										<SongCard
											key={track.id}
											track={track}
											rank={index + 1}
											actions={<FavoriteButton songId={track.id} />}
										/>
									))}
						</div>
					</div>
				)}

				{/* 검색 결과가 없을 때 */}
				{!loading && lastQuery && searchResults.length === 0 && !error && (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">😢</div>
						<h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
						<p className="text-zinc-400 mb-4">"{lastQuery}"에 대한 결과를 찾을 수 없습니다</p>
						<p className="text-zinc-500 text-sm">다른 검색어를 시도해보세요</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default SongSearch;
