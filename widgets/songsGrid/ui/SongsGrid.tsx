"use client";

import { LoadingSkeleton, SongCard } from "@/entities/track";
import { useSpotifyCharts } from "@/features/charts";
import { FavoriteButton } from "@/features/favorites";

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
								<SongCard
									key={track.id}
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
						<p className="text-sm mt-2">데이터 제공: Spotify</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default SongsGrid;
