import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type UserInfo = {
	nickname: string;
	avatar_url: string | null;
};

type CommentWithUser = {
	id: string;
	post_id: string;
	user_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	User?: UserInfo;
};

type FormattedComment = CommentWithUser & {
	author?: {
		nickname: string;
		avatar_url: string | null;
	};
};

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const resolvedParams = await params;
	const postId = resolvedParams.id;

	if (!postId) {
		return NextResponse.json({ message: "게시글 ID가 필요합니다" }, { status: 400 });
	}

	try {
		// 댓글 목록 조회
		const { data: comments, error } = await supabase
			.from("CommunityComment")
			.select(`
        *,
        User:user_id (
          nickname,
          avatar_url
        )
      `)
			.eq("post_id", postId)
			.order("created_at", { ascending: true });

		if (error) {
			console.error("댓글 조회 오류:", error);
			return NextResponse.json(
				{ message: "댓글을 불러오는 중 오류가 발생했습니다" },
				{ status: 500 },
			);
		}

		// 댓글 목록에 사용자 정보 추가
		const commentsWithUserInfo = comments.map((comment: CommentWithUser) => {
			return {
				...comment,
				author: comment.User
					? {
							nickname: comment.User.nickname,
							avatar_url: comment.User.avatar_url,
						}
					: undefined,
			};
		});

		return NextResponse.json({ comments: commentsWithUserInfo });
	} catch (error) {
		console.error("댓글 조회 오류:", error);
		return NextResponse.json(
			{ message: "댓글을 불러오는 중 오류가 발생했습니다" },
			{ status: 500 },
		);
	}
}

// POST: 새 댓글 작성
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const postId = resolvedParams.id;
	if (!postId) {
		return NextResponse.json({ message: "게시글 ID가 필요합니다" }, { status: 400 });
	}

	try {
		// 요청 본문 가져오기
		const requestBody = await request.json();
		const { content, userId } = requestBody;

		if (!userId) {
			return NextResponse.json({ message: "사용자 ID가 필요합니다" }, { status: 400 });
		}

		if (!content || content.trim() === "") {
			return NextResponse.json({ message: "댓글 내용이 필요합니다" }, { status: 400 });
		}

		// 댓글 생성
		const { data: comment, error: commentError } = await supabase
			.from("CommunityComment")
			.insert({
				post_id: postId,
				user_id: userId,
				content,
			})
			.select(`
        *,
        User:user_id (
          nickname,
          avatar_url
        )
      `)
			.single();

		if (commentError) {
			console.error("댓글 작성 오류:", commentError);
			return NextResponse.json({ message: "댓글 작성 중 오류가 발생했습니다" }, { status: 500 });
		}

		// User 정보를 author로 매핑
		const formattedComment: FormattedComment = {
			...comment,
			author: comment.User
				? {
						nickname: comment.User.nickname,
						avatar_url: comment.User.avatar_url,
					}
				: undefined,
		};

		return NextResponse.json({ comment: formattedComment }, { status: 201 });
	} catch (error) {
		console.error("댓글 작성 오류:", error);
		return NextResponse.json({ message: "댓글 작성 중 오류가 발생했습니다" }, { status: 500 });
	}
}

// 댓글 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const postId = resolvedParams.id;
	if (!postId) {
		return NextResponse.json({ message: "게시글 ID가 필요합니다" }, { status: 400 });
	}

	try {
		const body = await request.json();

		const { commentId, content, userId } = body;

		if (!commentId) {
			return NextResponse.json({ message: "댓글 ID가 필요합니다" }, { status: 400 });
		}

		if (!userId) {
			return NextResponse.json({ message: "사용자 ID가 필요합니다" }, { status: 400 });
		}

		if (!content || content.trim() === "") {
			return NextResponse.json({ message: "댓글 내용이 필요합니다" }, { status: 400 });
		}

		// 댓글 작성자 확인
		const { data: commentData, error: commentError } = await supabase
			.from("CommunityComment")
			.select("user_id")
			.eq("id", commentId)
			.single();

		if (commentError) {
			return NextResponse.json({ message: "댓글을 찾을 수 없습니다" }, { status: 404 });
		}

		// 작성자가 아닌 경우 수정 불가
		if (commentData.user_id !== userId) {
			return NextResponse.json(
				{ message: "다른 사용자의 댓글을 수정할 수 없습니다" },
				{ status: 403 },
			);
		}

		// 댓글 수정
		const { data: updatedComment, error } = await supabase
			.from("CommunityComment")
			.update({ content })
			.eq("id", commentId)
			.select()
			.single();

		// 수정된 댓글에 대한 사용자 정보 가져오기
		let userData = null;
		if (updatedComment) {
			try {
				const { data: user, error: userError } = await supabase
					.from("User")
					.select("nickname, avatar_url")
					.eq("id", updatedComment.user_id)
					.single();

				if (!userError && user) {
					userData = user;
				} else if (userError) {
					console.error("사용자 정보 조회 오류:", userError);
				}
			} catch (_userFetchError) {
				console.error("사용자 정보 조회 중 오류:", _userFetchError);
			}
		}

		if (error) {
			return NextResponse.json({ message: "댓글 수정 중 오류가 발생했습니다" }, { status: 500 });
		}

		// User 정보를 author로 매핑
		const formattedComment: FormattedComment = {
			...updatedComment,
			author: userData
				? {
						nickname: userData.nickname || "익명의 음악 애호가",
						avatar_url: userData.avatar_url,
					}
				: {
						nickname: "익명의 음악 애호가",
						avatar_url: null,
					},
		};
		return NextResponse.json({ comment: formattedComment });
	} catch (error) {
		// 기본 오류 로깅만 유지
		console.error("댓글 수정 오류:", error);

		return NextResponse.json({ message: "댓글 수정 중 오류가 발생했습니다" }, { status: 500 });
	}
}

// 댓글 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const postId = resolvedParams.id;
	if (!postId) {
		return NextResponse.json({ message: "게시글 ID가 필요합니다" }, { status: 400 });
	}

	try {
		// URL에서 댓글 ID와 사용자 ID 가져오기
		const url = new URL(request.url);
		const commentId = url.searchParams.get("commentId");
		const userId = url.searchParams.get("userId");

		if (!commentId) {
			return NextResponse.json({ message: "댓글 ID가 필요합니다" }, { status: 400 });
		}

		if (!userId) {
			return NextResponse.json({ message: "사용자 ID가 필요합니다" }, { status: 400 });
		}

		// 댓글 작성자 확인
		const { data: commentData, error: commentError } = await supabase
			.from("CommunityComment")
			.select("user_id")
			.eq("id", commentId)
			.single();

		if (commentError) {
			return NextResponse.json({ message: "댓글을 찾을 수 없습니다" }, { status: 404 });
		}

		// 작성자가 아닌 경우 삭제 불가
		if (commentData.user_id !== userId) {
			return NextResponse.json(
				{ message: "다른 사용자의 댓글을 삭제할 수 없습니다" },
				{ status: 403 },
			);
		}

		// 댓글 삭제
		const { error } = await supabase.from("CommunityComment").delete().eq("id", commentId);

		if (error) {
			return NextResponse.json({ message: "댓글 삭제 중 오류가 발생했습니다" }, { status: 500 });
		}

		return NextResponse.json({ message: "댓글이 삭제되었습니다" });
	} catch (error) {
		console.error("댓글 삭제 오류:", error);
		return NextResponse.json({ message: "댓글 삭제 중 오류가 발생했습니다" }, { status: 500 });
	}
}
