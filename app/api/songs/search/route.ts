import { type NextRequest, NextResponse } from "next/server";

// Spotify API 응답 타입 정의
interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

interface SpotifyArtist {
	id: string;
	name: string;
	external_urls: {
		spotify: string;
	};
}

interface SpotifyAlbum {
	id: string;
	name: string;
	release_date: string;
	images: Array<{
		height: number;
		width: number;
		url: string;
	}>;
}

interface SpotifyTrack {
	id: string;
	name: string;
	artists: SpotifyArtist[];
	album: SpotifyAlbum;
	external_urls: {
		spotify: string;
	};
}

interface SpotifySearchResponse {
	tracks: {
		items: SpotifyTrack[];
		total: number;
		limit: number;
		offset: number;
	};
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const limit = parseInt(searchParams.get("limit") || "10");

		if (!query || query.trim().length === 0) {
			return NextResponse.json({ songs: [] });
		}

		// Spotify API에서 곡 검색
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

		const tokenData = (await tokenResponse.json()) as SpotifyTokenResponse;
		const accessToken = tokenData.access_token;

		// Spotify에서 곡 검색
		const searchResponse = await fetch(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		if (!searchResponse.ok) {
			console.error("Spotify 검색 실패");
			return NextResponse.json({ error: "곡 검색에 실패했습니다" }, { status: 500 });
		}

		const searchData = (await searchResponse.json()) as SpotifySearchResponse;
		const tracks = searchData.tracks?.items || [];

		// Spotify 트랙 데이터를 우리 형식으로 변환
		const songs = tracks.map((track: SpotifyTrack) => ({
			id: track.id,
			title: track.name,
			artist: track.artists.map((artist: SpotifyArtist) => artist.name).join(", "),
			album: track.album.name,
			release_date: track.album.release_date,
			cover_image_url: track.album.images[0]?.url || null,
		}));

		return NextResponse.json({ songs });
	} catch (error) {
		console.error("곡 검색 중 오류:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
	}
}
