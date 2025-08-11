"use client";

import { useEffect, useState } from "react";

import type { SpotifyTrack } from "@/entities/track";
import type { ChartData } from "../types";

const useSpotifyCharts = (chartType: "korea" | "billboard" = "korea") => {
	const [charts, setCharts] = useState<SpotifyTrack[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCharts = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/spotify/charts?type=${chartType}`);
				const data: ChartData = await response.json();

				if (data.success) {
					setCharts(data.tracks);
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
	}, [chartType]);

	const refetch = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/spotify/charts?type=${chartType}`);
			const data: ChartData = await response.json();

			if (data.success) {
				setCharts(data.tracks);
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

	return {
		charts,
		loading,
		error,
		refetch,
	};
};

export default useSpotifyCharts;
