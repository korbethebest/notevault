import { type NextRequest, NextResponse } from "next/server";

import { createRouteHandlerClient } from "@/libs";

type FavoriteWithSong = {
	id: string;
	song_id: string;
	Song?: {
		id: string;
		title: string;
		artist: string;
		album?: string;
		cover_image_url?: string;
	} | null;
};

type SpotifyArtist = {
	id: string;
	name: string;
	external_urls: object;
	href: string;
	type: string;
	uri: string;
};

type SpotifyTrackData = {
	id: string;
	name: string;
	artists: SpotifyArtist[];
	album: {
		id: string;
		name: string;
		images: Array<{
			url: string;
			height: number;
			width: number;
		}>;
		release_date: string;
	};
	external_urls: object;
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
};

async function getAuthenticatedUser(request: NextRequest) {
	const supabase = createRouteHandlerClient(request);

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		return null;
	}

	return user;
}

export async function GET(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const supabase = createRouteHandlerClient(request);
		const { data: favorites, error } = await supabase
			.from("UserFavoriteSongs")
			.select(`
				id,
				song_id,
				Song (
					id,
					title,
					artist,
					album,
					cover_image_url
				)
			`)
			.eq("user_id", user.id);

		if (error) {
			console.error("Error fetching favorites:", error);
			return NextResponse.json(
				{
					error: "Failed to fetch favorites",
					details: error.message,
					code: error.code,
				},
				{ status: 500 },
			);
		}

		const enrichedFavorites = await Promise.all(
			favorites?.map(async (favorite: unknown) => {
				const typedFavorite = favorite as FavoriteWithSong;
				if (!typedFavorite.Song || !typedFavorite.Song?.title) {
					try {
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

						if (tokenResponse.ok) {
							const tokenData = await tokenResponse.json();
							const accessToken = tokenData.access_token;

							const trackResponse = await fetch(
								`https://api.spotify.com/v1/tracks/${typedFavorite.song_id}`,
								{
									headers: {
										Authorization: `Bearer ${accessToken}`,
									},
								},
							);

							if (trackResponse.ok) {
								const trackData: SpotifyTrackData = await trackResponse.json();
								return {
									...typedFavorite,
									Song: {
										id: trackData.id,
										title: trackData.name,
										artist:
											trackData.artists?.map((artist: SpotifyArtist) => artist.name).join(", ") ||
											"Unknown Artist",
										album: trackData.album?.name || null,
										cover_image_url: trackData.album?.images?.[0]?.url || null,
									},
								};
							}
						}
					} catch (error) {
						console.error("Error fetching from Spotify API:", error);
					}
				}
				return typedFavorite;
			}) || [],
		);

		return NextResponse.json({ favorites: enrichedFavorites });
	} catch (error) {
		console.error("Unexpected error in GET /api/user/favorites:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

// POST: 좋아하는 곡 추가
export async function POST(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);
		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { songId } = body;

		if (!songId) {
			return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
		}

		const supabase = createRouteHandlerClient(request);
		const { data: existing, error: checkError } = await supabase
			.from("UserFavoriteSongs")
			.select("id")
			.eq("user_id", user.id)
			.eq("song_id", songId)
			.single();

		if (checkError && checkError.code !== "PGRST116") {
			console.error("Error checking existing favorite:", checkError);
			return NextResponse.json(
				{ error: "Database error while checking existing favorite", details: checkError.message },
				{ status: 500 },
			);
		}

		if (existing) {
			return NextResponse.json({ error: "Song already in favorites" }, { status: 409 });
		}

		// 먼저 Song 테이블에 해당 곡이 존재하는지 확인
		const { data: existingSong } = await supabase
			.from("Song")
			.select("id")
			.eq("id", songId)
			.single();

		// Song 테이블에 곡이 없는 경우, Spotify API에서 데이터를 가져와 Song 테이블에 먼저 추가
		if (!existingSong) {
			try {
				// Spotify API 토큰 가져오기
				const SPOTIFY_CLIENT_ID = process.env.NEXT_SPOTIFY_CLIENT_KEY;
				const SPOTIFY_CLIENT_SECRET = process.env.NEXT_SPOTIFY_CLIENT_SECRET;

				if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
					console.error("Spotify credentials not configured");
					return NextResponse.json(
						{
							error: "Spotify API configuration missing",
							details: "Server configuration error",
						},
						{ status: 500 },
					);
				}

				const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
					"base64",
				);

				const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Basic ${credentials}`,
					},
					body: "grant_type=client_credentials",
				});

				if (!tokenResponse.ok) {
					return NextResponse.json(
						{ error: "Failed to authenticate with Spotify" },
						{ status: 500 },
					);
				}

				const tokenData = await tokenResponse.json();
				const accessToken = tokenData.access_token;

				// Spotify API에서 곡 정보 가져오기
				const spotifyResponse = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				if (!spotifyResponse.ok) {
					console.error("Failed to fetch song from Spotify:", await spotifyResponse.text());
					return NextResponse.json(
						{
							error: "Song not found in database or Spotify",
							details: "The song ID does not exist",
						},
						{ status: 404 },
					);
				}

				const spotifyData = await spotifyResponse.json();

				// Song 테이블에 곡 정보 추가
				const { error: songInsertError } = await supabase.from("Song").insert({
					id: songId,
					title: spotifyData.name,
					artist: spotifyData.artists.map((artist: SpotifyArtist) => artist.name).join(", "),
					album: spotifyData.album?.name,
					cover_image_url: spotifyData.album?.images?.[0]?.url,
				});

				if (songInsertError) {
					return NextResponse.json(
						{
							error: "Failed to add song to database",
							details: songInsertError.message,
						},
						{ status: 500 },
					);
				}
			} catch (spotifyError) {
				return NextResponse.json(
					{
						error: "Failed to fetch song data",
						details: spotifyError instanceof Error ? spotifyError.message : String(spotifyError),
					},
					{ status: 500 },
				);
			}
		}

		// 좋아요 추가
		const { error: insertError } = await supabase.from("UserFavoriteSongs").insert({
			user_id: user.id,
			song_id: songId,
		});

		if (insertError) {
			console.error("Error inserting favorite:", insertError);
			return NextResponse.json(
				{
					error: "Failed to add to favorites",
					details: insertError.message,
					code: insertError.code,
				},
				{ status: 500 },
			);
		}
		return NextResponse.json({ message: "Song added to favorites" });
	} catch (error) {
		console.error("Unexpected error in POST /api/user/favorites:", error);
		return NextResponse.json(
			{
				error: `Internal server error: ${error}`,
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}

// DELETE: 좋아하는 곡 제거
export async function DELETE(request: NextRequest) {
	try {
		const user = await getAuthenticatedUser(request);

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { songId } = await request.json();

		if (!songId) {
			return NextResponse.json({ error: "Song ID is required" }, { status: 400 });
		}

		const supabase = createRouteHandlerClient(request);
		const { error } = await supabase
			.from("UserFavoriteSongs")
			.delete()
			.eq("user_id", user.id)
			.eq("song_id", songId);

		if (error) {
			return NextResponse.json({ error: "Failed to remove from favorites" }, { status: 500 });
		}

		return NextResponse.json({ message: "Song removed from favorites" });
	} catch (error) {
		return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
	}
}
