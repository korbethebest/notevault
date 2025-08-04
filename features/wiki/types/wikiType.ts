export type WikiData = {
	id: string;
	song_id: string;
	created_by: string;
	content: string;
	created_at: string;
	updated_at: string;
	user_nickname?: string;
};

export type TrackDisplayInfo = {
	albumImage: { url: string; height: number; width: number } | null;
	durationFormatted: string | null;
	releaseYear: number | null;
	popularity: number | null;
};
