"use client";

import { useEffect, useState } from "react";

import type { CommunityPost } from "../types";
import CommunityPostCard from "./CommunityPostCard";

function CommunityPostList() {
	const [posts, setPosts] = useState<CommunityPost[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const response = await fetch("/api/community/posts");

			if (!response.ok) {
				throw new Error("게시글을 불러오는데 실패했습니다");
			}

			const data = await response.json();
			setPosts(data.posts || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, i) => (
					<div key={i} className="bg-zinc-900 rounded-lg p-6 animate-pulse">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
							<div className="space-y-2">
								<div className="h-4 bg-zinc-700 rounded w-24"></div>
								<div className="h-3 bg-zinc-700 rounded w-16"></div>
							</div>
						</div>
						<div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
						<div className="h-4 bg-zinc-700 rounded w-1/2"></div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
				<p className="text-red-400 mb-4">{error}</p>
				<button
					onClick={fetchPosts}
					className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
				>
					다시 시도
				</button>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="bg-zinc-900 rounded-lg p-12 text-center">
				<div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-zinc-500"
					>
						<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
					</svg>
				</div>
				<h3 className="text-lg font-medium text-zinc-300 mb-2">아직 게시글이 없습니다</h3>
				<p className="text-zinc-500">첫 번째 게시글을 작성해보세요!</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{posts.map((post) => (
				<CommunityPostCard key={post.id} post={post} />
			))}
		</div>
	);
}

export default CommunityPostList;
