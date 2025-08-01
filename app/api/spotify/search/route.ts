import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.NEXT_SPOTIFY_CLIENT_KEY;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_SPOTIFY_CLIENT_SECRET;

type SpotifyTrack = {
	id: string;
	name: string;
	artists: Array<{
		name: string;
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
	preview_url: string | null;
};

type SpotifySearchResponse = {
	tracks: {
		items: SpotifyTrack[];
	};
};

async function getSpotifyAccessToken(): Promise<string> {
	if (!SPOTIFY_CLIENT_ID) {
		throw new Error("Spotify Client ID is not configured");
	}

	if (!SPOTIFY_CLIENT_SECRET) {
		throw new Error("Spotify Client Secret is not configured");
	}

	const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
		"base64",
	);

	const response = await fetch("https://accounts.spotify.com/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${credentials}`,
		},
		body: "grant_type=client_credentials",
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Failed to get Spotify access token: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	const data = await response.json();
	return data.access_token;
}

async function searchTracks(accessToken: string, query: string): Promise<SpotifyTrack[]> {
	const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10&market=KR`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("Spotify Search API Error:", {
			status: response.status,
			statusText: response.statusText,
			body: errorText,
			query,
		});
		throw new Error(
			`Failed to search tracks: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	const data: SpotifySearchResponse = await response.json();

	if (!data.tracks?.items) {
		return [];
	}

	// 유효한 트랙만 필터링
	const tracks = data.tracks.items.filter((track: SpotifyTrack) => track?.id && track?.name);

	return tracks;
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");

		if (!query || query.trim().length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: "검색어를 입력해주세요",
				},
				{ status: 400 },
			);
		}

		const accessToken = await getSpotifyAccessToken();
		const tracks = await searchTracks(accessToken, query.trim());

		return NextResponse.json({
			success: true,
			query: query.trim(),
			tracks,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 },
		);
	}
}
