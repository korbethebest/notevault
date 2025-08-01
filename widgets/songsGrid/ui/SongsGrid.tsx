"use client";

import Image from "next/image";

import type { SpotifyTrack } from "@/entities/track";
import { useSpotifyCharts } from "@/features/charts";

type SongCardProps = {
	track: SpotifyTrack;
	rank: number;
};

function SongCard({ track, rank }: SongCardProps) {
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

function LoadingSkeleton() {
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

function SongsGrid() {
	const { charts, loading, error } = useSpotifyCharts();

	if (error) {
		return (
			<div className="min-h-screen bg-black text-white p-8">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-900/20 border border-red-800 p-6 rounded-xl">
						<h3 className="text-xl font-semibold mb-2 text-red-400">음악을을 불러올 수 없습니다</h3>
						<p className="text-red-300 text-sm">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white p-8">
			<div className="max-w-7xl mx-auto">
				{/* 헤더 */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">🎵 국내 TOP 100</h1>
					<p className="text-zinc-400 text-lg">
						Spotify에서 가장 인기 있는 국내 음악들을 만나보세요
					</p>
				</div>

				{/* 그리드 */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
					{loading
						? Array.from({ length: 24 }, (_, i) => `loading-${i}-${Date.now()}`).map((key) => (
								<LoadingSkeleton key={key} />
							))
						: charts.map((track, index) => (
								<SongCard key={track.id} track={track} rank={index + 1} />
							))}
				</div>

				{/* 푸터 정보 */}
				{!loading && charts.length > 0 && (
					<div className="text-center mt-12 text-zinc-400">
						<p>총 {charts.length}곡의 인기 음악</p>
						<p className="text-sm mt-2">데이터 제공: Spotify</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default SongsGrid;
