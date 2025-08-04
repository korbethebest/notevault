import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
	try {
		const trackId = params.id;

		if (!trackId) {
			return NextResponse.json({ error: "Track ID is required" }, { status: 400 });
		}

		// Spotify API 토큰 가져오기
		const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: `Basic ${Buffer.from(
					`${process.env.NEXT_SPOTIFY_CLIENT_KEY}:${process.env.NEXT_SPOTIFY_CLIENT_SECRET}`,
				).toString("base64")}`,
			},
			body: "grant_type=client_credentials",
		});

		if (!tokenResponse.ok) {
			console.error("Failed to get Spotify token");
			return NextResponse.json({ error: "Failed to authenticate with Spotify" }, { status: 500 });
		}

		const tokenData = await tokenResponse.json();
		const accessToken = tokenData.access_token;

		// Spotify에서 트랙 정보 가져오기
		const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!trackResponse.ok) {
			if (trackResponse.status === 404) {
				return NextResponse.json({ error: "Track not found" }, { status: 404 });
			}
			console.error("Failed to fetch track from Spotify");
			return NextResponse.json({ error: "Failed to fetch track information" }, { status: 500 });
		}

		const trackData = await trackResponse.json();

		// SpotifyTrack 형식으로 변환
		const formattedTrack = {
			id: trackData.id,
			name: trackData.name,
			artists: trackData.artists.map((artist: any) => ({
				id: artist.id,
				name: artist.name,
			})),
			album: {
				id: trackData.album.id,
				name: trackData.album.name,
				images: trackData.album.images,
				release_date: trackData.album.release_date,
			},
			external_urls: trackData.external_urls,
			duration_ms: trackData.duration_ms,
			popularity: trackData.popularity,
			preview_url: trackData.preview_url,
		};

		return NextResponse.json(formattedTrack);
	} catch (error) {
		console.error("Error fetching track:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
