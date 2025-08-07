import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const limit = parseInt(searchParams.get("limit") || "20");
		const offset = parseInt(searchParams.get("offset") || "0");

		const { data: posts, error } = await supabase
			.from("CommunityPost")
			.select(`
				*,
				User(
					nickname,
					avatar_url
				),
				Song(
					title,
					artist,
					album,
					cover_image_url
				)
			  `)
			.order("created_at", { ascending: false })
			.range(offset, offset + limit - 1);

		if (error) {
			return NextResponse.json({ error: "게시글을 가져올 수 없습니다" }, { status: 500 });
		}

		// 댓글 수 가져오기 및 데이터 구조 정리
		const postsWithDetails = await Promise.all(
			(posts || []).map(async (post) => {
				// 댓글 수 가져오기
				const { count: commentsCount } = await supabase
					.from("CommunityComment")
					.select("*", { count: "exact", head: true })
					.eq("post_id", post.id);

				// 데이터 구조 정리
				const processedPost = {
					...post,
					User: post.User || post.author, // 두 가지 가능성 모두 사용
					author: post.author || post.User, // 두 가지 가능성 모두 사용
					song: post.song || post.Song,
					comments_count: commentsCount || 0,
				};

				return processedPost;
			}),
		);

		return NextResponse.json({ posts: postsWithDetails });
	} catch (error) {
		console.error("게시글 조회 중 오류:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { user_id, song_id, title, content, song_data, user_info } = body;

		if (!user_id || !song_id || !title || !content) {
			return NextResponse.json({ error: "모든 필드를 입력해주세요" }, { status: 400 });
		}

		const { data: existingUser } = await supabase
			.from("User")
			.select("id")
			.eq("id", user_id)
			.single();

		if (!existingUser && user_info) {
			const { error: userInsertError } = await supabase.from("User").insert({
				id: user_info.id,
				email: user_info.email,
				nickname: user_info.nickname,
				role: "user",
			});

			if (userInsertError) {
				console.error("사용자 생성 오류:", userInsertError);
			}
		}

		const { data: existingSong } = await supabase
			.from("Song")
			.select("id")
			.eq("id", song_id)
			.single();

		if (!existingSong && song_data) {
			const { error: songError } = await supabase.from("Song").insert({
				id: song_data.id,
				title: song_data.title,
				artist: song_data.artist,
				album: song_data.album,
				release_date: song_data.release_date,
				cover_image_url: song_data.cover_image_url,
			});

			if (songError) {
				console.error("곡 저장 오류:", songError);
			}
		}

		const { data: post, error } = await supabase
			.from("CommunityPost")
			.insert({
				user_id,
				song_id,
				title,
				content,
			})
			.select(`
				*,
				author:User!CommunityPost_user_id_fkey (
					nickname,
					avatar_url
				),
				song:Song!CommunityPost_song_id_fkey (
					title,
					artist,
					album,
					cover_image_url
				)
			`)
			.single();

		if (error) {
			console.error("게시글 생성 오류:", error);
			return NextResponse.json({ error: "게시글 작성에 실패했습니다" }, { status: 500 });
		}

		return NextResponse.json({ post }, { status: 201 });
	} catch (error) {
		console.error("게시글 작성 중 오류:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
	}
}
