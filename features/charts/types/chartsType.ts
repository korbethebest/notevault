export type SpotifyTrack = {
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

export type ChartData = {
	success: boolean;
	region: string;
	tracks: SpotifyTrack[];
	error?: string;
};
