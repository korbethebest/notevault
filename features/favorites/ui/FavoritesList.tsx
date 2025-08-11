"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { createClientSupabaseClient } from "@/libs";
import { useAuth } from "@/shared";
import FavoriteButton from "./FavoriteButton";

type FavoriteItem = {
	id: string;
	song_id: string;
	Song: {
		id: string;
		title: string;
		artist: string;
		album?: string;
		cover_image_url?: string;
	};
};

function FavoritesList() {
	const { user } = useAuth();
	const isSignedIn = !!user;
	const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isSignedIn || !user) {
			setIsLoading(false);
			return;
		}

		const fetchFavorites = async () => {
			try {
				const {
					data: { session },
				} = await createClientSupabaseClient().auth.getSession();
				if (!session) {
					setIsLoading(false);
					return;
				}

				const response = await fetch("/api/user/favorites", {
					headers: {
						Authorization: `Bearer ${session.access_token}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setFavorites(data.favorites || []);
				}
			} catch (error) {
				console.error("Error fetching favorites:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFavorites();
	}, [isSignedIn, user]);

	const handleFavoriteRemoved = (songId: string) => {
		setFavorites((prev) => prev.filter((item) => item.song_id !== songId));
	};

	if (!isSignedIn) {
		return (
			<div className="text-center py-6 sm:py-8">
				<p className="text-gray-400 text-sm sm:text-base">로그인이 필요합니다.</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="text-center py-6 sm:py-8">
				<div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-500 mx-auto mb-3 sm:mb-4"></div>
				<p className="text-gray-400 text-sm sm:text-base">좋아하는 곡을 불러오는 중...</p>
			</div>
		);
	}

	if (favorites.length === 0) {
		return (
			<div className="text-center py-8 sm:py-12">
				<div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🎵</div>
				<h3 className="text-lg sm:text-xl font-semibold mb-2">아직 좋아하는 곡이 없습니다</h3>
				<p className="text-gray-400 text-sm sm:text-base mb-5 sm:mb-6 px-4 sm:px-0">
					음악을 발견하고 하트 버튼을 눌러 좋아하는 곡을 저장해보세요!
				</p>
				<a
					href="/"
					className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors"
				>
					음악 발견하러 가기
				</a>
			</div>
		);
	}

	return (
		<div className="space-y-3 sm:space-y-4 max-w-full">
			<h2 className="text-xl sm:text-2xl font-bold text-green-500 mb-4 sm:mb-6 text-center sm:text-left">
				좋아하는 곡 ({favorites.length})
			</h2>

			<div className="grid gap-3 sm:gap-4 mx-auto w-full">
				{favorites.map((item) => (
					<div
						key={item.id}
						className="bg-gray-900 rounded-lg p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 hover:bg-gray-800 transition-colors overflow-hidden"
					>
						{/* 앨범 커버 */}
						<div className="flex-shrink-0">
							{item.Song.cover_image_url ? (
								<Image
									src={item.Song.cover_image_url}
									alt={`${item.Song.title} 앨범 커버`}
									width={64}
									height={64}
									className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
								/>
							) : (
								<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700 rounded-lg flex items-center justify-center">
									<svg
										className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							)}
						</div>

						{/* 곡 정보 */}
						<div className="flex-1 min-w-0 max-w-[60%]">
							<h3 className="font-semibold text-white text-sm sm:text-base truncate">
								{item.Song.title}
							</h3>
							<p className="text-gray-400 text-xs sm:text-sm truncate">{item.Song.artist}</p>
							{item.Song.album && (
								<p className="text-gray-500 text-xs sm:text-sm truncate">{item.Song.album}</p>
							)}
						</div>

						{/* 좋아요 버튼 */}
						<div className="flex-shrink-0">
							<FavoriteButton songId={item.song_id} onFavoriteChange={handleFavoriteRemoved} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default FavoritesList;
