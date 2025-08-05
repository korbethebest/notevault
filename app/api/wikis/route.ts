import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type SpotifyTrack = {
	id: string;
	name: string;
	artists: Array<{
		name: string;
		id: string;
	}>;
	album: {
		name: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
	};
	external_urls: {
		spotify: string;
	};
};

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

function isRecord(val: unknown): val is Record<string, unknown> {
	return typeof val === "object" && val !== null;
}

function isValidSpotifyTrack(track: unknown): track is SpotifyTrack {
	if (!isRecord(track)) return false;

	if (
		typeof track.id !== "string" ||
		typeof track.name !== "string" ||
		!Array.isArray(track.artists) ||
		!track.artists.every(
			(artist) =>
				isRecord(artist) && typeof artist.name === "string" && typeof artist.id === "string",
		)
	)
		return false;

	if (
		!isRecord(track.album) ||
		typeof track.album.name !== "string" ||
		!Array.isArray(track.album.images) ||
		!track.album.images.every(
			(image) =>
				isRecord(image) &&
				typeof image.url === "string" &&
				typeof image.height === "number" &&
				typeof image.width === "number",
		)
	)
		return false;

	if (!isRecord(track.external_urls) || typeof track.external_urls.spotify !== "string")
		return false;

	return true;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "20");
		const offset = parseInt(searchParams.get("offset") || "0");

		// Wiki 데이터 가져오기 (최신순)
		const { data: wikis, error } = await supabase
			.from("SongWiki")
			.select("*")
			.order("updated_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			console.error("Wiki 조회 오류:", error);
			return NextResponse.json({ error: "Wiki 데이터를 가져올 수 없습니다" }, { status: 500 });
		}

		if (!wikis || wikis.length === 0) {
			return NextResponse.json({ wikis: [] });
		}

		// Spotify API에서 트랙 정보 가져오기
		const spotifyClientId = process.env.NEXT_SPOTIFY_CLIENT_KEY!;
		const spotifyClientSecret = process.env.NEXT_SPOTIFY_CLIENT_SECRET!;

		// Spotify 액세스 토큰 가져오기
		const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64")}`,
			},
			body: "grant_type=client_credentials",
		});

		if (!tokenResponse.ok) {
			console.error("Spotify 토큰 가져오기 실패");
			return NextResponse.json({ error: "Spotify API 인증 실패" }, { status: 500 });
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// 각 wiki에 대해 Spotify 트랙 정보 가져오기
		const wikisWithTracks: WikiWithTrack[] = [];

		for (const wiki of wikis) {
			try {
				const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${wiki.song_id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (trackResponse.ok) {
					const trackData = await trackResponse.json();
					if (isValidSpotifyTrack(trackData)) {
						wikisWithTracks.push({
							...wiki,
							track: trackData,
						});
					}
				}
			} catch (error) {
				console.error(`트랙 ${wiki.song_id} 정보 가져오기 실패:`, error);
			}
		}

		return NextResponse.json({ wikis: wikisWithTracks });
	} catch (error) {
		console.error("Wiki 목록 조회 중 오류:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
	}
}
