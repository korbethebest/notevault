"use client";

import { useState } from "react";
import useAuth from "../../../shared/hooks/useAuth";

type CommentFormProps = {
	postId: string;
	onCommentAdded: () => void;
};

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
	const { user } = useAuth();
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim()) {
			setError("댓글 내용을 입력해주세요");
			return;
		}

		try {
			setIsSubmitting(true);
			setError(null);

			// 로그인하지 않은 경우 오류 처리
			if (!user) {
				setError("댓글을 작성하려면 로그인이 필요합니다");
				return;
			}

			// 요청 본문 만들기
			const requestBody = {
				content,
				userId: user.id,
			};

			const response = await fetch(`/api/community/posts/${postId}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			if (response.ok) {
				setContent("");
				onCommentAdded();
			} else {
				const data = await response.json();
				setError(data.message || "댓글 작성 중 오류가 발생했습니다");
			}
		} catch (_err) {
			setError("댓글 작성 중 오류가 발생했습니다");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mt-6">
			<div className="mb-4">
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="댓글을 작성해주세요..."
					className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
					rows={3}
					disabled={isSubmitting}
				/>
			</div>

			{error && <div className="mb-4 text-red-400 text-sm">{error}</div>}

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? "작성 중..." : "댓글 작성"}
				</button>
			</div>
		</form>
	);
}
