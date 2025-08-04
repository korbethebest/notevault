import { useEffect, useState } from "react";

import { supabase } from "@/shared";
import type { WikiData } from "../types";

export function useWikiData(songId: string) {
	const [wikiData, setWikiData] = useState<WikiData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWikiData = async () => {
		if (!songId) return;

		setLoading(true);
		setError(null);

		try {
			const { data, error: supabaseError } = await supabase
				.from("SongWiki")
				.select(
					`
						id,
						song_id,
						created_by,
						content,
						created_at,
						updated_at,
						User!inner(nickname)
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
				const wikiWithNickname = {
					...data,
					user_nickname: (data.User as any)?.nickname || "알 수 없음",
				};
				setWikiData(wikiWithNickname);
			} else {
				// 위키 데이터가 없으면 null로 설정
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

	const saveWikiData = async (content: string, currentUser: any): Promise<boolean> => {
		if (!currentUser || !songId) return false;

		try {
			if (wikiData) {
				// 기존 위키 업데이트
				const { error } = await supabase
					.from("SongWiki")
					.update({
						content,
						updated_at: new Date().toISOString(),
					})
					.eq("id", wikiData.id);

				if (error) throw error;
			} else {
				// 새 위키 생성
				const { error } = await supabase.from("SongWiki").insert({
					song_id: songId,
					created_by: currentUser.id,
					content,
				});

				if (error) throw error;
			}

			// 데이터 다시 가져오기
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
