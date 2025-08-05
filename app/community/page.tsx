import { CommunityPostList, CreatePostButton } from "@/features/community";

export default function Community() {
	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-4xl mx-auto px-6 py-8">
				{/* 헤더 */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">커뮤니티</h1>
						<p className="text-zinc-400">
							좋아하는 음악에 대해 이야기하고 다른 사람들과 소통해보세요
						</p>
					</div>
					<CreatePostButton />
				</div>

				{/* 게시글 목록 */}
				<CommunityPostList />
			</div>
		</div>
	);
}
