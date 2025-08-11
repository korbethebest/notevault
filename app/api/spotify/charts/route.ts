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

type PlaylistTrack = {
	track: SpotifyTrack;
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

async function getPopularTracks(
	accessToken: string,
	chartType: string = "korea",
): Promise<SpotifyTrack[]> {
	const koreaTop100PlaylistId = "4cRo44TavIHN54w46OqRVc";
	const billboardTop100PlaylistId = "6UeSakyzhiEt4NB3UAd6NQ";

	const playlistId = chartType === "billboard" ? billboardTop100PlaylistId : koreaTop100PlaylistId;
	const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(id,name,artists(name),album(name,images),external_urls,preview_url))`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("Spotify Playlist API Error:", {
			status: response.status,
			statusText: response.statusText,
			body: errorText,
			playlistId,
		});
		throw new Error(
			`Failed to fetch playlist tracks: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	const data = await response.json();

	if (!data.items) {
		return [];
	}

	const tracks = data.items
		.map((item: PlaylistTrack) => item.track)
		.filter((track: SpotifyTrack) => track?.id && track?.name);

	return tracks;
}

export async function GET(request: Request) {
	try {
		const accessToken = await getSpotifyAccessToken();
		const { searchParams } = new URL(request.url);
		const chartType = searchParams.get("type") || "korea";

		const tracks = await getPopularTracks(accessToken, chartType);

		return NextResponse.json({
			success: true,
			region: "korea",
			tracks: tracks.slice(0, 100),
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
