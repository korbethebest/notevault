import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/libs";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id: postId } = await params;

		if (!postId) {
			return NextResponse.json({ error: "게시글 ID가 필요합니다" }, { status: 400 });
		}

		const supabase = createRouteHandlerClient(request);
		const { data: post, error } = await supabase
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
			.eq("id", postId)
			.single();

		if (error) {
			console.error("커뮤니티 게시글 조회 오류:", error);
			if (error.code === "PGRST116") {
				return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
			}
			return NextResponse.json({ error: "게시글을 가져올 수 없습니다" }, { status: 500 });
		}

		if (!post) {
			return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
		}

		// 댓글 수 가져오기
		const { count: commentsCount } = await supabase
			.from("CommunityComment")
			.select("*", { count: "exact", head: true })
			.eq("post_id", post.id);

		const postWithDetails = {
			...post,
			author: post.User || null,
			song: post.Song || null,
			comments_count: commentsCount || 0,
		};

		return NextResponse.json({ post: postWithDetails });
	} catch (error) {
		console.error("커뮤니티 게시글 상세 조회 중 오류:", error);
		return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
	}
}
