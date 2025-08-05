import { CreatePostForm } from "@/features/community";

export default function CreateCommunityPost() {
	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-2xl mx-auto px-6 py-8">
				{/* 헤더 */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">새 게시글 작성</h1>
					<p className="text-zinc-400">좋아하는 곡에 대한 이야기를 커뮤니티와 공유해보세요</p>
				</div>

				{/* 게시글 작성 폼 */}
				<CreatePostForm />
			</div>
		</div>
	);
}
