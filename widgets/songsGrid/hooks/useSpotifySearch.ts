"use client";

import { useState } from "react";

import type { SpotifyTrack } from "@/entities/track";

type SearchData = {
	success: boolean;
	query: string;
	tracks: SpotifyTrack[];
	error?: string;
};

const useSpotifySearch = () => {
	const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastQuery, setLastQuery] = useState<string>("");

	const searchTracks = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			setError(null);
			setLastQuery("");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query.trim())}`);
			const data: SearchData = await response.json();

			if (data.success) {
				setSearchResults(data.tracks);
				setLastQuery(query.trim());
			} else {
				throw new Error(data.error || "검색에 실패했습니다");
			}
		} catch (err) {
			console.error("Search error:", err);
			setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다");
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	const clearSearch = () => {
		setSearchResults([]);
		setError(null);
		setLastQuery("");
		setLoading(false);
	};

	return {
		searchResults,
		loading,
		error,
		lastQuery,
		searchTracks,
		clearSearch,
	};
};

export default useSpotifySearch;
