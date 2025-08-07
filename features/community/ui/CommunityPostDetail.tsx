"use client";

import Image from "next/image";
import { useState } from "react";
import type { CommunityPost } from "../types";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type CommunityPostDetailProps = {
	post: CommunityPost;
};

function CommunityPostDetail({ post }: CommunityPostDetailProps) {
	const [commentsKey, setCommentsKey] = useState(0);

	// 댓글이 추가되면 CommentList를 리프레시하기 위한 함수
	const handleCommentAdded = () => {
		setCommentsKey((prev) => prev + 1);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="bg-zinc-900 rounded-lg p-6">
			{/* 제목 */}
			<h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

			{/* 작성자 정보 */}
			<div className="flex items-center mb-6 pb-4 border-b border-zinc-700">
				<div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden relative">
					{post.User?.avatar_url ? (
						<Image
							src={post.User.avatar_url}
							alt={post.User.nickname || "사용자"}
							fill
							className="object-cover rounded-full"
						/>
					) : (
						<span className="text-zinc-300 text-sm font-medium">
							{post.User?.nickname?.[0] || "U"}
						</span>
					)}
				</div>
				<div className="ml-3">
					<p className="text-sm font-medium text-white">
						{post.User?.nickname || "익명의 음악 애호가"}
					</p>
					<p className="text-sm text-zinc-400">{formatDate(post.created_at)}</p>
				</div>
			</div>

			{/* 곡 정보 */}
			{post.song && (
				<div className="mb-6 p-4 bg-zinc-800 rounded-lg">
					<h3 className="text-lg font-semibold text-white mb-3">관련 곡</h3>
					<div className="flex items-center">
						{post.song.cover_image_url && (
							<div className="relative w-16 h-16 mr-4">
								<Image
									src={post.song.cover_image_url}
									alt={post.song.title}
									fill
									className="rounded-lg object-cover"
								/>
							</div>
						)}
						<div>
							<h4 className="font-medium text-white">{post.song.title}</h4>
							<p className="text-zinc-400">{post.song.artist}</p>
							{post.song.album && <p className="text-sm text-zinc-500">{post.song.album}</p>}
						</div>
					</div>
				</div>
			)}

			{/* 게시글 내용 */}
			<div className="prose prose-invert max-w-none">
				<div className="whitespace-pre-wrap text-white leading-relaxed">{post.content}</div>
			</div>

			{/* 댓글 섹션 */}
			<CommentList key={commentsKey} postId={post.id} />
			<CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
		</div>
	);
}

export default CommunityPostDetail;
