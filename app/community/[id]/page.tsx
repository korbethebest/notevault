"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { CommunityPost } from "@/features/community";

export default function CommunityPostDetailPage() {
	const params = useParams();
	const postId = params.id as string;
	const [post, setPost] = useState<CommunityPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`/api/community/posts/${postId}`);
				if (response.ok) {
					const data = await response.json();
					setPost(data.post);
				} else {
					setError("게시글을 찾을 수 없습니다");
				}
			} catch {
				setError("게시글을 불러오는 중 오류가 발생했습니다");
			} finally {
				setLoading(false);
			}
		};

		if (postId) {
			fetchPost();
		}
	}, [postId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="animate-pulse">
						<div className="h-8 bg-zinc-800 rounded mb-4"></div>
						<div className="h-64 bg-zinc-800 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="min-h-screen bg-black text-white">
				<div className="max-w-4xl mx-auto px-6 py-8 text-center">
					<h1 className="text-2xl font-bold text-white mb-4">
						{error || "게시글을 찾을 수 없습니다"}
					</h1>
					<Link href="/community" className="text-green-400 hover:text-green-300 font-medium">
						커뮤니티로 돌아가기
					</Link>
				</div>
			</div>
		);
	}

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
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-4xl mx-auto px-6 py-8">
				{/* 뒤로가기 버튼 */}
				<div className="mb-6">
					<Link
						href="/community"
						className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
					>
						<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						커뮤니티로 돌아가기
					</Link>
				</div>

				{/* 게시글 상세 내용 */}
				<div className="bg-zinc-900 rounded-lg p-6">
					{/* 제목 */}
					<h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

					{/* 작성자 정보 */}
					<div className="flex items-center mb-6 pb-4 border-b border-zinc-700">
						<div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
							<span className="text-white font-medium">{post.author?.nickname?.[0] || "U"}</span>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-white">
								{post.author?.nickname || "익명의 음악 애호가"}
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

					{/* 댓글 섹션 (향후 구현) */}
					<div className="mt-8 pt-6 border-t border-zinc-700">
						<h3 className="text-lg font-semibold text-white mb-4">댓글</h3>
						<div className="text-zinc-400 text-center py-8">댓글 기능은 곧 추가될 예정입니다.</div>
					</div>
				</div>
			</div>
		</div>
	);
}
