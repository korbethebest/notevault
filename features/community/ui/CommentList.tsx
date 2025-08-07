"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import useAuth from "../../../shared/model/useAuth";

import type { CommunityComment } from "../types";

type CommentListProps = {
	postId: string;
};

export default function CommentList({ postId }: CommentListProps) {
	const { user } = useAuth();
	const [comments, setComments] = useState<CommunityComment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");

	useEffect(() => {
		const fetchComments = async () => {
			try {
				setLoading(true);
				const response = await fetch(`/api/community/posts/${postId}/comments`);

				if (response.ok) {
					const data = await response.json();
					setComments(data.comments);
				} else {
					setError("댓글을 불러오는 중 오류가 발생했습니다");
				}
			} catch (_err) {
				setError("댓글을 불러오는 중 오류가 발생했습니다");
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [postId]);

	// 댓글 수정 함수
	const handleEditComment = async (commentId: string, content: string) => {
		if (!user) return;

		try {
			console.log("Sending edit request:", { commentId, content, userId: user.id });

			const response = await fetch(`/api/community/posts/${postId}/comments`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					commentId,
					content,
					userId: user.id,
				}),
				credentials: "include", // 쿠키 포함
			});

			console.log("Edit response status:", response.status);

			if (response.ok) {
				const data = await response.json();
				console.log("Edit response data:", data);
				// 수정된 댓글로 대체
				setComments(comments.map((c) => (c.id === commentId ? data.comment : c)));
				setEditingCommentId(null);
				setEditContent("");
			} else {
				const errorText = await response.text();
				console.error("Edit error response:", errorText);
				try {
					const errorData = JSON.parse(errorText);
					alert(errorData.message || "댓글 수정 중 오류가 발생했습니다");
				} catch (_e) {
					alert("댓글 수정 중 오류가 발생했습니다");
				}
			}
		} catch (err) {
			console.error("댓글 수정 오류:", err);
			alert("댓글 수정 중 오류가 발생했습니다");
		}
	};

	// 댓글 삭제 함수
	const handleDeleteComment = async (commentId: string) => {
		if (!user) return;

		if (!confirm("댓글을 삭제하시겠습니까?")) return;

		try {
			const response = await fetch(
				`/api/community/posts/${postId}/comments?commentId=${commentId}&userId=${user.id}`,
				{
					method: "DELETE",
				},
			);

			if (response.ok) {
				// 삭제된 댓글 제거
				setComments(comments.filter((c) => c.id !== commentId));
			} else {
				const errorData = await response.json();
				alert(errorData.message || "댓글 삭제 중 오류가 발생했습니다");
			}
		} catch (_err) {
			alert("댓글 삭제 중 오류가 발생했습니다");
		}
	};

	// 수정 모드 시작
	const startEditing = (comment: CommunityComment) => {
		setEditingCommentId(comment.id);
		setEditContent(comment.content);
	};

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

	if (loading) {
		return (
			<div className="mt-8 pt-6 border-t border-zinc-700">
				<h3 className="text-lg font-semibold text-white mb-4">댓글</h3>
				<div className="animate-pulse space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="flex space-x-3">
							<div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
							<div className="flex-1 space-y-2">
								<div className="h-4 bg-zinc-700 rounded w-1/4"></div>
								<div className="h-3 bg-zinc-700 rounded w-full"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="mt-8 pt-6 border-t border-zinc-700">
				<h3 className="text-lg font-semibold text-white mb-4">댓글</h3>
				<div className="text-zinc-400 text-center py-4">{error}</div>
			</div>
		);
	}

	return (
		<div className="mt-8 pt-6 border-t border-zinc-700">
			<h3 className="text-lg font-semibold text-white mb-4">
				댓글 {comments.length > 0 ? `(${comments.length})` : ""}
			</h3>

			{comments.length === 0 ? (
				<div className="text-zinc-400 text-center py-4">아직 댓글이 없습니다</div>
			) : (
				<div className="space-y-6">
					{comments.map((comment) => (
						<div key={comment.id} className="flex space-x-3">
							<div className="flex-shrink-0">
								<div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden relative">
									{comment.author?.avatar_url ? (
										<Image
											src={comment.author.avatar_url}
											alt={comment.author.nickname || "사용자"}
											fill
											className="object-cover rounded-full"
										/>
									) : (
										<span className="text-zinc-300 text-sm font-medium">
											{comment.author?.nickname?.[0] || "U"}
										</span>
									)}
								</div>
							</div>
							<div className="flex-1">
								<div className="flex items-center mb-1">
									<span className="text-sm font-medium text-white">
										{comment.author?.nickname || "익명의 음악 애호가"}
									</span>
									<span className="text-xs text-zinc-500 ml-2">
										{formatDate(comment.created_at)}
									</span>

									{/* 수정/삭제 버튼 (본인 댓글인 경우에만 표시) */}
									{user && user.id === comment.user_id && (
										<div className="ml-auto flex space-x-2">
											<button
												onClick={() => startEditing(comment)}
												className="p-1 text-blue-400 hover:text-blue-300 rounded-full hover:bg-zinc-800 transition-colors"
												title="댓글 수정"
											>
												<PencilIcon className="w-3.5 h-3.5" />
											</button>
											<button
												onClick={() => handleDeleteComment(comment.id)}
												className="p-1 text-red-400 hover:text-red-300 rounded-full hover:bg-zinc-800 transition-colors"
												title="댓글 삭제"
											>
												<TrashIcon className="w-3.5 h-3.5" />
											</button>
										</div>
									)}
								</div>

								{editingCommentId === comment.id ? (
									<div className="mt-2">
										<textarea
											value={editContent}
											onChange={(e) => setEditContent(e.target.value)}
											className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent resize-none text-sm"
											rows={3}
										/>
										<div className="flex justify-end mt-2 space-x-2">
											<button
												onClick={() => setEditingCommentId(null)}
												className="px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-white rounded-md"
											>
												취소
											</button>
											<button
												onClick={() => handleEditComment(comment.id, editContent)}
												className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md"
											>
												저장
											</button>
										</div>
									</div>
								) : (
									<div className="text-zinc-300 text-sm whitespace-pre-wrap">{comment.content}</div>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
