import { useEffect, useState } from "react";
import type { SpotifyTrack } from "@/entities/track";
import type { WikiData } from "../types";

type UserWikiWithTrack = {
	wiki: WikiData;
	track: SpotifyTrack;
};

export function useUserWiki(userId: string) {
	const [wikis, setWikis] = useState<UserWikiWithTrack[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserWikis = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch user's wikis
				const response = await fetch(`/api/user/${userId}/wikis`);
				if (!response.ok) {
					throw new Error("Failed to fetch user wikis");
				}

				const userWikis = await response.json();
				setWikis(userWikis);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		if (userId) {
			fetchUserWikis();
		}
	}, [userId]);

	return { wikis, loading, error };
}
