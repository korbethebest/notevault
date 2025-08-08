import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/libs";

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
		release_date?: string;
	};
	external_urls: {
		spotify: string;
	};
	duration_ms: number;
	popularity: number;
	preview_url: string | null;
};

type WikiData = {
	id: string;
	song_id: string;
	created_by: string;
	content: string;
	created_at: string;
	updated_at: string;
};

type WikiWithTrack = {
	wiki: WikiData;
	track: SpotifyTrack;
};

type SupabaseWikiResponse = {
	id: string;
	song_id: string;
	created_by: string;
	content: string;
	created_at: string;
	updated_at: string;
	Song: {
		id: string;
		title: string;
		artist: string;
		album: string | null;
		release_date: string | null;
		cover_image_url: string | null;
	} | null;
};

function convertToSpotifyTrack(song: SupabaseWikiResponse["Song"]): SpotifyTrack | null {
	if (!song) return null;

	return {
		id: song.id,
		name: song.title,
		artists: song.artist.split(", ").map((name) => ({ name, id: "" })),
		album: {
			name: song.album || "Unknown Album",
			images: song.cover_image_url
				? [
						{
							url: song.cover_image_url,
							height: 640,
							width: 640,
						},
					]
				: [],
			release_date: song.release_date || undefined,
		},
		external_urls: {
			spotify: `https://open.spotify.com/track/${song.id}`,
		},
		duration_ms: 0,
		popularity: 0,
		preview_url: null,
	};
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	try {
		const { userId } = await params;

		if (!userId) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		const supabase = createRouteHandlerClient(request);
		// Step 1: Query SongWiki with Song data only
		const { data: wikis, error: wikisError } = await supabase
			.from("SongWiki")
			.select(`
				*,
				Song(*)
			`)
			.eq("created_by", userId)
			.order("updated_at", { ascending: false });

		if (wikisError && wikisError.code !== "PGRST116") {
			return NextResponse.json({ error: "Failed to fetch user wikis" }, { status: 500 });
		}

		if (!wikis || wikis.length === 0) {
			return NextResponse.json([]);
		}

		// Transform the database data to expected format
		const wikisWithTracks = wikis
			.map((item: SupabaseWikiResponse) => {
				const wiki = {
					id: item.id,
					song_id: item.song_id,
					created_by: item.created_by,
					content: item.content,
					created_at: item.created_at,
					updated_at: item.updated_at,
				};

				// Convert Song to SpotifyTrack format
				const track = convertToSpotifyTrack(item.Song);

				return track ? { wiki, track } : null;
			})
			.filter((item): item is WikiWithTrack => item !== null);

		return NextResponse.json(wikisWithTracks);
	} catch (error) {
		console.error("Error fetching user wikis:", error);
		return NextResponse.json({ error: "Failed to fetch user wikis" }, { status: 500 });
	}
}
