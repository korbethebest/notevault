import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@/libs";

// 인증된 사용자 정보 가져오기 (Route Handler용 클라이언트 사용)
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

// GET: 특정 곡이 사용자의 좋아요 목록에 있는지 확인
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ songId: string }> },
) {
	try {
		const user = await getAuthenticatedUser(request);

		if (!user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { songId } = await params;

		const supabase = createRouteHandlerClient(request);
		const { data, error } = await supabase
			.from("UserFavoriteSongs")
			.select("id")
			.eq("user_id", user.id)
			.eq("song_id", songId)
			.single();

		if (error && error.code !== "PGRST116") {
			return NextResponse.json({ error: "Internal server error" }, { status: 500 });
		}

		const isFavorite = !!data;

		return NextResponse.json({ isFavorite });
	} catch (error) {
		return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
	}
}
