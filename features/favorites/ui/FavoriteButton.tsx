"use client";

import { useState } from "react";

import { useAuth } from "@/shared";
import { useFavorites } from "../model";

type FavoriteButtonProps = {
	songId: string;
	onFavoriteChange?: (songId: string, isFavorite: boolean) => void;
};

function FavoriteButton({ songId, onFavoriteChange }: FavoriteButtonProps) {
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

	return (
		<button
			className={`flex items-center justify-center p-2 rounded-full transition-all ${currentIsFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-300"}`}
			onClick={toggleFavorite}
			disabled={isLoading || isAuthLoading || favoritesLoading}
		>
			{isLoading || favoritesLoading ? (
				<svg
					className="animate-spin h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			) : currentIsFavorite ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
						clipRule="evenodd"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
					/>
				</svg>
			)}
		</button>
	);
}

export default FavoriteButton;
