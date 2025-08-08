import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import type { SpotifyTrack } from "@/entities/track";
import { createClientSupabaseClient } from "@/libs";
import type { WikiDataWithNickname } from "../types";

type SupabaseWikiResponse = {
	id: string;
	song_id: string;
	created_by: string;
	content: string;
	created_at: string;
	updated_at: string;
	User:
		| {
				nickname: string;
		  }[]
		| {
				nickname: string;
		  }
		| null;
};

export function useWikiData(songId: string) {
	const [wikiData, setWikiData] = useState<WikiDataWithNickname | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWikiData = async () => {
		if (!songId) return;

		setLoading(true);
		setError(null);

		try {
			const { data, error: supabaseError } = await createClientSupabaseClient()
				.from("SongWiki")
				.select(
					`
						*,
						User!created_by(nickname)
					`,
				)
				.eq("song_id", songId)
				.order("updated_at", { ascending: false })
				.limit(1)
				.single();

			if (supabaseError && supabaseError.code !== "PGRST116") {
				console.error("위키 데이터 조회 오류:", supabaseError);
				setError("위키 데이터를 불러올 수 없습니다");
			} else if (data) {
				const supabaseData = data as SupabaseWikiResponse;

				let nickname = "알 수 없음";
				if (supabaseData.User) {
					if (Array.isArray(supabaseData.User) && supabaseData.User.length > 0) {
						nickname = supabaseData.User[0]?.nickname || "알 수 없음";
					} else if (!Array.isArray(supabaseData.User) && "nickname" in supabaseData.User) {
						nickname = supabaseData.User.nickname || "알 수 없음";
					}
				}

				const typedData: WikiDataWithNickname = {
					id: supabaseData.id,
					song_id: supabaseData.song_id,
					created_by: supabaseData.created_by,
					content: supabaseData.content,
					created_at: supabaseData.created_at,
					updated_at: supabaseData.updated_at,
					nickname: nickname,
				};
				setWikiData(typedData);
			} else {
				setWikiData(null);
			}
		} catch (error) {
			console.error("위키 데이터 조회 중 오류:", error);
			setError("위키 데이터 조회 중 오류가 발생했습니다");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWikiData();
	}, [songId]);

	const saveWikiData = async (
		content: string,
		currentUser: User | null,
		trackData?: SpotifyTrack | null,
	): Promise<boolean> => {
		if (!currentUser || !songId) return false;

		try {
			if (wikiData) {
				const { error } = await createClientSupabaseClient()
					.from("SongWiki")
					.update({
						content,
						updated_at: new Date().toISOString(),
					})
					.eq("id", wikiData.id);

				if (error) throw error;
			} else {
				const songData = {
					id: songId,
					title: trackData?.name || "Unknown Title",
					artist: trackData?.artists.map((artist) => artist.name).join(", ") || "Unknown Artist",
					album: trackData?.album.name || null,
					release_date: trackData?.album.release_date || null,
					cover_image_url: trackData?.album.images[0]?.url || null,
				};

				const { error: songUpsertError } = await createClientSupabaseClient()
					.from("Song")
					.upsert(songData, { onConflict: "id" });

				if (songUpsertError) {
					throw songUpsertError;
				}

				const { error } = await createClientSupabaseClient().from("SongWiki").insert({
					song_id: songId,
					created_by: currentUser.id,
					content,
				});

				if (error) {
					throw error;
				}
			}

			await fetchWikiData();
			return true;
		} catch (error) {
			console.error("위키 저장 중 오류:", error);
			return false;
		}
	};

	return {
		wikiData,
		loading,
		error,
		saveWikiData,
		refetch: fetchWikiData,
	};
}
