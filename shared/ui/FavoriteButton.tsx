"use client";

import { useState } from "react";
import { useAuth } from "@/shared";
import { useFavorites } from "@/shared/contexts/FavoritesContext";

interface FavoriteButtonProps {
	songId: string;
	onFavoriteChange?: (songId: string, isFavorite: boolean) => void;
}

export default function FavoriteButton({ songId, onFavoriteChange }: FavoriteButtonProps) {
	const { user, isLoading: isAuthLoading, isSignedIn } = useAuth();
	const { isFavorite, addFavorite, removeFavorite, isLoading: favoritesLoading } = useFavorites();
	const [isLoading, setIsLoading] = useState(false);

	const currentIsFavorite = isFavorite(songId);

	const toggleFavorite = async (e: React.MouseEvent) => {
		if (!isSignedIn || !user) {
			alert("로그인이 필요합니다.");
			return;
		}

		e.stopPropagation();
		setIsLoading(true);

		try {
			let success = false;

			if (currentIsFavorite) {
				success = await removeFavorite(songId);
			} else {
				success = await addFavorite(songId);
			}

			if (success) {
				onFavoriteChange?.(songId, !currentIsFavorite);
			} else {
				alert("오류가 발생했습니다.");
			}
		} catch (error) {
			console.error("Error toggling favorite:", error);
			alert("오류가 발생했습니다.");
		} finally {
			setIsLoading(false);
		}
	};

	// 인증되지 않은 사용자에게는 버튼을 숨김 (단, 로딩 중에는 표시)
	if (!isSignedIn && !isAuthLoading) {
		return null;
	}

	const isButtonDisabled = isLoading || isAuthLoading || favoritesLoading || !isSignedIn;

	return (
		<button
			onClick={toggleFavorite}
			disabled={isButtonDisabled}
			className={`
				flex items-center justify-center
				w-8 h-8 rounded-full
				transition-all duration-200
				${
					currentIsFavorite ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"
				}
				${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}
			`}
			title={
				isAuthLoading
					? "로딩 중..."
					: !isSignedIn
						? "로그인이 필요합니다"
						: currentIsFavorite
							? "좋아요 취소"
							: "좋아요"
			}
		>
			{isLoading || isAuthLoading || favoritesLoading ? (
				<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
			) : (
				<svg
					className="w-5 h-5"
					fill={currentIsFavorite ? "currentColor" : "none"}
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
			)}
		</button>
	);
}
