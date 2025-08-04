import { useEffect, useState } from "react";

import type { SpotifyTrack } from "@/entities/track";

export function useSpotifyTrack(songId: string) {
	const [trackData, setTrackData] = useState<SpotifyTrack | null>(null);
	const [trackLoading, setTrackLoading] = useState(true);
	const [trackError, setTrackError] = useState<string | null>(null);

	useEffect(() => {
		if (!songId) return;

		const fetchTrackData = async () => {
			setTrackLoading(true);
			setTrackError(null);

			try {
				const response = await fetch(`/api/spotify/track/${songId}`);
				if (response.ok) {
					const track = await response.json();
					setTrackData(track);
				} else {
					const errorText = response.statusText || "Unknown error";
					setTrackError(`곡 정보를 가져올 수 없습니다: ${errorText}`);
					console.error("곡 정보를 가져올 수 없습니다:", errorText);
				}
			} catch (error) {
				const errorMessage = "곡 정보 조회 중 오류가 발생했습니다";
				setTrackError(errorMessage);
				console.error("곡 정보 조회 중 오류:", error);
			} finally {
				setTrackLoading(false);
			}
		};

		fetchTrackData();
	}, [songId]);

	return {
		trackData,
		trackLoading,
		trackError,
	};
}
