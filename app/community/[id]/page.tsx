"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { type CommunityPost, CommunityPostDetail } from "@/features/community";

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
				<CommunityPostDetail post={post} />
			</div>
		</div>
	);
}
