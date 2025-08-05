import Image from "next/image";
import Link from "next/link";

import type { CommunityPost } from "../types";

type CommunityPostCardProps = {
	post: CommunityPost;
};

function CommunityPostCard({ post }: CommunityPostCardProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Link href={`/community/${post.id}`} className="block">
			<div className="bg-zinc-900 rounded-lg p-6 hover:bg-zinc-800 transition-colors cursor-pointer">
				{/* 작성자 정보 */}
				<div className="flex items-center gap-3 mb-4">
					<div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden">
						{post.author?.avatar_url ? (
							<div className="relative w-full h-full">
								<Image
									src={post.author.avatar_url}
									alt={post.author.nickname}
									fill
									className="object-cover"
								/>
							</div>
						) : (
							<span className="text-zinc-300 text-sm font-medium">
								{post.author?.nickname?.[0] || "U"}
							</span>
						)}
					</div>
					<div>
						<p className="text-zinc-300 font-medium text-sm">
							{post.author?.nickname || "익명의 음악 애호가"}
						</p>
						<p className="text-zinc-500 text-xs">{formatDate(post.created_at)}</p>
					</div>
				</div>

				{/* 게시글 제목 */}
				<h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>

				{/* 게시글 내용 미리보기 */}
				<p className="text-zinc-400 text-sm mb-4 line-clamp-3">{post.content}</p>

				{/* 곡 정보 */}
				{post.song && (
					<div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg mb-4">
						{post.song.cover_image_url && (
							<div className="relative w-12 h-12">
								<Image
									src={post.song.cover_image_url}
									alt={post.song.title}
									fill
									className="rounded object-cover"
								/>
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-white font-medium text-sm truncate">{post.song.title}</p>
							<p className="text-zinc-400 text-xs truncate">{post.song.artist}</p>
						</div>
					</div>
				)}

				{/* 하단 정보 */}
				<div className="flex items-center justify-between text-sm text-zinc-500">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
							</svg>
							{post.comments_count || 0}
						</span>
					</div>
					<span className="text-green-400 text-sm font-medium">클릭하여 자세히 보기</span>
				</div>
			</div>
		</Link>
	);
}

export default CommunityPostCard;
