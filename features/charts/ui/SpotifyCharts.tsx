"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import type { SpotifyTrack } from "@/entities/track";
import { useSpotifyCharts } from "../hooks";

type TrackItemProps = {
	track: SpotifyTrack;
	rank: number;
};

function TrackItem({ track, rank }: TrackItemProps) {
	const router = useRouter();
	const albumImage = track.album.images.find((img) => img.height >= 64) || track.album.images[0];

	const handleTrackClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('a[href*="spotify.com"]')) {
			return;
		}
		router.push(`/song/${track.id}`);
	};

	return (
		<div
			className="flex items-center gap-3 p-3 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
			onClick={handleTrackClick}
		>
			<div className="text-zinc-400 font-mono text-sm w-6 text-right">{rank}</div>

			{albumImage && (
				<Image
					key={albumImage.url}
					src={albumImage.url}
					alt={track.album.name}
					width={albumImage.width}
					height={albumImage.height}
					className="w-12 h-12 rounded-md object-cover"
				/>
			)}

			<div className="flex-1 min-w-0">
				<div className="font-medium text-white truncate">{track.name}</div>
				<div className="text-sm text-zinc-400 truncate">
					{track.artists.map((artist) => artist.name).join(", ")}
				</div>
			</div>

			<a
				href={track.external_urls.spotify}
				target="_blank"
				rel="noopener noreferrer"
				className="text-[#1DB954] hover:text-[#1ed760] transition-colors p-2 z-10"
				title="Spotify에서 듣기"
				onClick={(e) => e.stopPropagation()}
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
	);
}

interface ChartSectionProps {
	title: string;
	tracks: SpotifyTrack[];
	loading: boolean;
}

function ChartSection({ title, tracks, loading }: ChartSectionProps) {
	if (loading) {
		return (
			<div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
				<h3 className="text-xl font-semibold mb-4 text-[#1DB954]">{title}</h3>
				<div className="space-y-3">
					{Array.from({ length: 10 }, (_, i) => `skeleton-${i}-${Date.now()}`).map((key) => (
						<div key={key} className="flex items-center gap-3 p-3">
							<div className="w-6 h-4 bg-zinc-700 rounded animate-pulse"></div>
							<div className="w-12 h-12 bg-zinc-700 rounded-md animate-pulse"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-zinc-700 rounded animate-pulse w-3/4"></div>
								<div className="h-3 bg-zinc-700 rounded animate-pulse w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
			<h3 className="text-xl font-semibold mb-4 text-[#1DB954]">{title}</h3>
			<div className="space-y-1 max-h-[600px] overflow-y-auto">
				{tracks.map((track, index) => (
					<TrackItem key={track.id} track={track} rank={index + 1} />
				))}
			</div>
		</div>
	);
}

export default function SpotifyCharts() {
	const { charts, loading, error } = useSpotifyCharts();

	if (error) {
		return (
			<div className="bg-red-900/20 border border-red-800 p-6 rounded-xl">
				<h3 className="text-xl font-semibold mb-2 text-red-400">
					Spotify 차트를 불러올 수 없습니다
				</h3>
				<p className="text-red-300 text-sm">{error}</p>
			</div>
		);
	}

	return (
		<div className="w-full space-y-8">
			<div className="text-center">
				<h2 className="text-2xl font-bold mb-2">🎵 국내 음악 차트</h2>
				<p className="text-zinc-400">Spotify 국내 TOP 100 차트를 확인해보세요</p>
			</div>

			<div className="max-w-4xl mx-auto">
				<ChartSection title="🇰🇷 국내 TOP 100" tracks={charts} loading={loading} />
			</div>
		</div>
	);
}
