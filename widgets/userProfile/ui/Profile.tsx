"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { User } from "@/entities/user";
import { ProfileWikiCard, useUserWiki } from "@/features/wiki";
import { useAuth } from "@/shared";

export default function Profile() {
	const { user: authUser } = useAuth();
	const [userProfile, setUserProfile] = useState<User | null>(null);
	const [imageError, setImageError] = useState(false);
	const { wikis, loading: wikisLoading, error } = useUserWiki(authUser?.id || "");

	// Convert Supabase User to our User type and fetch additional profile data
	useEffect(() => {
		if (authUser) {
			// For now, create a basic profile from auth user
			// In a real app, you might fetch additional profile data from your User table
			const profile: User = {
				id: authUser.id,
				email: authUser.email || "Unknown",
				nickname: authUser.user_metadata?.nickname || authUser.email?.split("@")[0] || "User",
				role: "user", // You might want to fetch this from your database
				avatar_url: authUser.user_metadata?.avatar_url || null,
			};
			setUserProfile(profile);
		}
	}, [authUser]);

	// Show loading state while auth is loading
	if (!authUser && !userProfile) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
					<p className="text-zinc-400">로그인 정보를 확인하는 중...</p>
				</div>
			</div>
		);
	}

	// Show login required state
	if (!authUser || !userProfile) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
					<p className="text-zinc-400 mb-6">프로필을 보려면 먼저 로그인해주세요.</p>
					<a
						href="/login"
						className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
					>
						로그인하기
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="container mx-auto px-4 py-8">
				{/* 사용자 정보 섹션 */}
				<div className="bg-zinc-900 rounded-xl p-6 mb-8">
					<div className="flex items-center space-x-6">
						{/* 프로필 이미지 */}
						<div className="relative w-24 h-24">
							{!imageError && userProfile.avatar_url ? (
								<Image
									src={userProfile.avatar_url}
									alt={userProfile.nickname}
									width={96}
									height={96}
									className="w-full h-full object-cover rounded-full"
									onError={() => setImageError(true)}
								/>
							) : (
								<div className="w-full h-full bg-zinc-700 rounded-full flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="48"
										height="48"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-zinc-400"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</div>
							)}
						</div>

						{/* 사용자 정보 */}
						<div className="flex-1">
							<h1 className="text-2xl font-bold text-white mb-2">{userProfile.nickname}</h1>
							<p className="text-zinc-400 mb-1">{userProfile.email}</p>
							<div className="flex items-center space-x-4">
								<span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
									{userProfile.role === "admin" ? "관리자" : "사용자"}
								</span>
								<span className="text-zinc-500 text-sm">기여한 위키: {wikis.length}개</span>
							</div>
						</div>
					</div>
				</div>

				{/* 위키 섹션 */}
				<div className="mb-6">
					<h2 className="text-xl font-semibold text-white mb-4">내가 작성한 위키</h2>

					{wikisLoading && (
						<div className="flex justify-center items-center py-12">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
						</div>
					)}

					{error && (
						<div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
							<p className="text-red-400">오류가 발생했습니다: {error}</p>
						</div>
					)}

					{!wikisLoading && !error && wikis.length === 0 && (
						<div className="bg-zinc-900 rounded-xl p-8 text-center">
							<div className="text-zinc-400 mb-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="48"
									height="48"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="mx-auto mb-4"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14,2 14,8 20,8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10,9 9,9 8,9" />
								</svg>
							</div>
							<h3 className="text-lg font-medium text-white mb-2">아직 작성한 위키가 없습니다</h3>
							<p className="text-zinc-400">좋아하는 곡에 대한 위키를 작성해보세요!</p>
						</div>
					)}

					{!wikisLoading && !error && wikis.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{wikis.map((item, index) => (
								<ProfileWikiCard
									key={item.wiki.id}
									wiki={item.wiki}
									track={item.track}
									index={index}
								/>
							))}
						</div>
					)}
				</div>

				{/* 통계 섹션 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-zinc-900 rounded-xl p-6 text-center">
						<div className="text-2xl font-bold text-blue-400 mb-2">{wikis.length}</div>
						<div className="text-zinc-400">작성한 위키</div>
					</div>
					<div className="bg-zinc-900 rounded-xl p-6 text-center">
						<div className="text-2xl font-bold text-green-400 mb-2">
							{new Set(wikis.map((w) => w.track.artists[0]?.name)).size}
						</div>
						<div className="text-zinc-400">다룬 아티스트</div>
					</div>
					<div className="bg-zinc-900 rounded-xl p-6 text-center">
						<div className="text-2xl font-bold text-purple-400 mb-2">
							{new Set(wikis.map((w) => w.track.album.name)).size}
						</div>
						<div className="text-zinc-400">다룬 앨범</div>
					</div>
				</div>
			</div>
		</div>
	);
}
