"use client";

import { useState } from "react";

import { LoadingSkeleton, SongCard } from "@/entities/track";
import { useSpotifyCharts } from "@/features/charts";
import { FavoriteButton } from "@/features/favorites";

function SongsGrid() {
	const [chartType, setChartType] = useState<"korea" | "billboard">("korea");
	const { charts, loading, error } = useSpotifyCharts(chartType);

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
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-4">🎵 Spotify TOP 100</h1>
					<p className="text-zinc-400 text-lg mb-6">
						Spotify에서 가장 인기 있는 음악들을 만나보세요
					</p>

					{/* 차트 타입 토글 버튼 */}
					<div className="flex justify-center mb-4">
						<div className="flex bg-zinc-800 rounded-lg p-1 border border-zinc-700">
							<button
								onClick={() => setChartType("korea")}
								className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
									chartType === "korea"
										? "bg-[#1DB954] text-black shadow-lg"
										: "text-zinc-400 hover:text-white hover:bg-zinc-700"
								}`}
							>
								🇰🇷 국내 TOP 100
							</button>
							<button
								onClick={() => setChartType("billboard")}
								className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
									chartType === "billboard"
										? "bg-[#1DB954] text-black shadow-lg"
										: "text-zinc-400 hover:text-white hover:bg-zinc-700"
								}`}
							>
								🇺🇸 Billboard TOP 100
							</button>
						</div>
					</div>

					<h2 className="text-2xl font-bold mt-8 mb-2">
						{chartType === "korea" ? "🇰🇷 국내 TOP 100" : "🇺🇸 Billboard TOP 100"}
					</h2>
				</div>

				{/* 그리드 */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
					{loading
						? Array.from({ length: 24 }, (_, i) => `loading-${i}-${Date.now()}`).map((key) => (
								<LoadingSkeleton key={key} />
							))
						: charts.map((track, index) => (
								<SongCard
									key={`${chartType}-${track.id}-${index}`}
									track={track}
									rank={index + 1}
									actions={<FavoriteButton songId={track.id} />}
								/>
							))}
				</div>

				{/* 푸터 정보 */}
				{!loading && charts.length > 0 && (
					<div className="text-center mt-12 text-zinc-400">
						<p>총 {charts.length}곡의 인기 음악</p>
						<p className="text-sm mt-2">
							데이터 제공: Spotify {chartType === "korea" ? "국내" : "Billboard"} Top 100 차트
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default SongsGrid;
