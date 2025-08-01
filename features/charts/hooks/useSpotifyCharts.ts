"use client";

import { useEffect, useState } from "react";

import type { SpotifyTrack } from "@/entities/track";
import type { ChartData } from "../types";

const useSpotifyCharts = () => {
	const [charts, setCharts] = useState<SpotifyTrack[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCharts = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch("/api/spotify/charts");
				const data: ChartData = await response.json();

				if (data.success) {
					setCharts(data.tracks);
					console.log("Charts loaded:", data.tracks.length, "tracks");
				} else {
					throw new Error(data.error || "Failed to fetch global charts");
				}
			} catch (err) {
				console.error("Hook error:", err);
				setError(err instanceof Error ? err.message : "Unknown error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchCharts();
	}, []);

	return {
		charts,
		loading,
		error,
		refetch: () => {
			setLoading(true);
			setError(null);
			// 다시 fetch 로직 실행
		},
	};
};

export default useSpotifyCharts;
