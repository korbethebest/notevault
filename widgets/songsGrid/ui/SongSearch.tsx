"use client";

import Image from "next/image";
import { useState } from "react";

import type { SpotifyTrack } from "@/entities/track";
import { useSpotifySearch } from "../hooks";

type SearchSongCardProps = {
	track: SpotifyTrack;
	rank: number;
};

function SearchSongCard({ track, rank }: SearchSongCardProps) {
	const albumImage = track.album.images.find((img) => img.height >= 300) || track.album.images[0];

	return (
		<div className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors group">
			{/* 순위 배지 */}
			<div className="flex justify-between items-start mb-3">
				<div className="bg-[#1DB954] text-black text-xs font-bold px-2 py-1 rounded-full">
					#{rank}
				</div>
				<a
					href={track.external_urls.spotify}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[#1DB954] hover:text-[#1ed760] transition-colors opacity-0 group-hover:opacity-100"
					title="Spotify에서 듣기"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
					</svg>
				</a>
			</div>

			{/* 앨범 커버 */}
			{albumImage && (
				<div className="relative mb-4 aspect-square">
					<Image
						src={albumImage.url}
						alt={track.album.name}
						width={albumImage.width}
						height={albumImage.height}
						className="w-full h-full object-cover rounded-lg"
					/>
				</div>
			)}

			{/* 곡 정보 */}
			<div className="space-y-2">
				<h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
					{track.name}
				</h3>
				<p className="text-zinc-400 text-xs line-clamp-1">
					{track.artists.map((artist) => artist.name).join(", ")}
				</p>
				<p className="text-zinc-500 text-xs line-clamp-1">{track.album.name}</p>
			</div>
		</div>
	);
}

function SearchLoadingSkeleton() {
	return (
		<div className="bg-zinc-900 rounded-xl p-4 animate-pulse">
			<div className="flex justify-between items-start mb-3">
				<div className="bg-zinc-700 h-5 w-8 rounded-full"></div>
			</div>
			<div className="aspect-square bg-zinc-700 rounded-lg mb-4"></div>
			<div className="space-y-2">
				<div className="h-4 bg-zinc-700 rounded w-full"></div>
				<div className="h-3 bg-zinc-700 rounded w-3/4"></div>
				<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
			</div>
		</div>
	);
}

function SongSearch() {
	const [searchQuery, setSearchQuery] = useState("");
	const { searchResults, loading, error, lastQuery, searchTracks, clearSearch } =
		useSpotifySearch();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			searchTracks(searchQuery);
		}
	};

	const handleClear = () => {
		setSearchQuery("");
		clearSearch();
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
								placeholder="예: BTS, 아이유, 뉴진스, 사랑노래..."
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
									className="bg-[#1DB954] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
										(key) => <SearchLoadingSkeleton key={key} />,
									)
								: searchResults.map((track, index) => (
										<SearchSongCard key={track.id} track={track} rank={index + 1} />
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
