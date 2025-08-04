import Image from "next/image";

import type { SpotifyTrack } from "@/entities/track";
import { getTrackDisplayInfo } from "../utils";

interface TrackInfoProps {
	trackData: SpotifyTrack;
}

export function TrackInfo({ trackData }: TrackInfoProps) {
	const displayInfo = getTrackDisplayInfo(trackData);

	if (!displayInfo) return null;

	return (
		<div className="mb-8 p-6 bg-zinc-900 rounded-xl border border-zinc-800">
			<div className="flex gap-6">
				{displayInfo.albumImage && (
					<Image
						src={displayInfo.albumImage.url}
						alt={trackData.album.name}
						width={displayInfo.albumImage.width}
						height={displayInfo.albumImage.height}
						className="w-24 h-24 rounded-lg object-cover shadow-lg"
					/>
				)}
				<div className="flex-1">
					<h2 className="text-3xl font-bold text-white mb-2">{trackData.name}</h2>
					<p className="text-xl text-zinc-300 mb-3">
						{trackData.artists.map((artist) => artist.name).join(", ")}
					</p>
					<div className="flex flex-wrap gap-4 text-sm text-zinc-400">
						{displayInfo.durationFormatted && (
							<span className="flex items-center gap-1">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clipRule="evenodd"
									/>
								</svg>
								{displayInfo.durationFormatted}
							</span>
						)}
						<span>앨범: {trackData.album.name}</span>
						{displayInfo.releaseYear && <span>발매: {displayInfo.releaseYear}</span>}
						{displayInfo.popularity && <span>인기도: {displayInfo.popularity}/100</span>}
					</div>
				</div>
				<a
					href={trackData.external_urls.spotify}
					target="_blank"
					rel="noopener noreferrer"
					className="text-[#1DB954] hover:text-[#1ed760] transition-colors flex items-center justify-center"
					title="Spotify에서 듣기"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
					</svg>
				</a>
			</div>
		</div>
	);
}
