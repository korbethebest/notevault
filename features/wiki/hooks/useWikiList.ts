import { useEffect, useState } from "react";

import type { SpotifyTrack } from "@/entities/track";

type WikiData = {
	id: string;
	song_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	user_id: string;
};

type WikiWithTrack = WikiData & {
	track: SpotifyTrack;
};

type UseWikiListReturn = {
	wikis: WikiWithTrack[];
	loading: boolean;
	error: string | null;
	loadMore: () => void;
	hasMore: boolean;
};

export function useWikiList(initialLimit = 20): UseWikiListReturn {
	const [wikis, setWikis] = useState<WikiWithTrack[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const fetchWikis = async (currentOffset: number, isLoadMore = false) => {
		try {
			if (!isLoadMore) {
				setLoading(true);
			}
			setError(null);

			const response = await fetch(`/api/wikis?limit=${initialLimit}&offset=${currentOffset}`);

			if (!response.ok) {
				throw new Error("Wiki 목록을 가져올 수 없습니다");
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			const newWikis = data.wikis || [];

			if (isLoadMore) {
				setWikis((prev) => [...prev, ...newWikis]);
			} else {
				setWikis(newWikis);
			}

			setHasMore(newWikis.length === initialLimit);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
		} finally {
			setLoading(false);
		}
	};

	const loadMore = () => {
		if (!loading && hasMore) {
			const newOffset = offset + initialLimit;
			setOffset(newOffset);
			fetchWikis(newOffset, true);
		}
	};

	useEffect(() => {
		fetchWikis(0);
	}, []);

	return {
		wikis,
		loading,
		error,
		loadMore,
		hasMore,
	};
}
