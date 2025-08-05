export interface CommunityPost {
	id: string;
	user_id: string;
	song_id: string;
	title: string;
	content: string;
	created_at: string;
	updated_at: string;
	// 조인된 데이터
	author?: {
		nickname: string;
		avatar_url?: string;
	};
	song?: {
		title: string;
		artist: string;
		album?: string;
		cover_image_url?: string;
	};
	comments_count?: number;
	// Supabase JOIN 결과 (내부적으로 사용)
	User?: {
		nickname: string;
		avatar_url?: string;
	};
	Song?: {
		title: string;
		artist: string;
		album?: string;
		cover_image_url?: string;
	};
}

export interface CommunityComment {
	id: string;
	post_id: string;
	user_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	// 조인된 데이터
	author?: {
		nickname: string;
		avatar_url?: string;
	};
}
