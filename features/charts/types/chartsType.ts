import type { SpotifyTrack } from "@/entities/track";

export type ChartData = {
	success: boolean;
	region: string;
	tracks: SpotifyTrack[];
	error?: string;
};
