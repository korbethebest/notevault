import type { SpotifyTrack } from "@/entities/track";
import type { TrackDisplayInfo } from "../types";

export function getTrackDisplayInfo(trackData: SpotifyTrack | null): TrackDisplayInfo | null {
	if (!trackData) return null;

	const albumImage =
		trackData.album.images.find((img) => img.height >= 300) || trackData.album.images[0] || null;

	const duration = trackData.duration_ms ? Math.floor(trackData.duration_ms / 1000) : 0;
	const minutes = Math.floor(duration / 60);
	const seconds = duration % 60;

	return {
		albumImage,
		durationFormatted: duration > 0 ? `${minutes}:${seconds.toString().padStart(2, "0")}` : null,
		releaseYear: trackData.album.release_date
			? new Date(trackData.album.release_date).getFullYear()
			: null,
		popularity: trackData.popularity || null,
	};
}

export function generateDefaultWikiContent(trackData: SpotifyTrack | null): string {
	if (trackData) {
		return `# ${trackData.name}

**아티스트:** ${trackData.artists.map((a) => a.name).join(", ")}

## 곡 정보

이 곡에 대한 정보를 추가해보세요!

## 가사 해석


## 개인적인 감상

`;
	}

	return `# 곡 정보

이 곡에 대한 정보를 추가해보세요!

## 가사 해석


## 개인적인 감상

`;
}
