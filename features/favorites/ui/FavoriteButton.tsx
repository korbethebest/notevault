"use client";

import { useEffect, useState, useTransition } from "react";

import { useAuth } from "@/shared";
import { useFavorites } from "../model";

type FavoriteButtonProps = {
	songId: string;
	onFavoriteChange?: (songId: string, isFavorite: boolean) => void;
};

function FavoriteButton({ songId, onFavoriteChange }: FavoriteButtonProps) {
	const { user, isLoading: isAuthLoading, isSignedIn } = useAuth();
	const { isFavorite, addFavorite, removeFavorite, isLoading: favoritesLoading } = useFavorites();
	const [isPending, startTransition] = useTransition();
	const [isError, setIsError] = useState(false);
	const currentIsFavorite = isFavorite(songId);
	const [optimisticFavorite, setOptimisticFavorite] = useState(currentIsFavorite);

	useEffect(() => {
		setOptimisticFavorite(currentIsFavorite);
	}, [currentIsFavorite]);

	const toggleFavorite = async (e: React.MouseEvent) => {
		if (!isSignedIn || !user) {
			alert("로그인이 필요합니다.");
			return;
		}

		e.stopPropagation();

		startTransition(async () => {
			const newFavoriteState = !optimisticFavorite;
			setOptimisticFavorite(newFavoriteState);
			setIsError(false);
			try {
				let success = false;

				if (!newFavoriteState) {
					success = await removeFavorite(songId);
				} else {
					success = await addFavorite(songId);
				}

				if (success) {
					onFavoriteChange?.(songId, newFavoriteState);
				} else {
					setOptimisticFavorite(!newFavoriteState);
					setIsError(true);
					console.error("좋아요 상태 변경 실패");
				}
			} catch (error) {
				setOptimisticFavorite(!newFavoriteState);
				setIsError(true);
				console.error("Error toggling favorite:", error);
			}
		});
	};

	if (!isSignedIn && !isAuthLoading) {
		return null;
	}

	return (
		<button
			className={`flex items-center justify-center p-2 rounded-full transition-all 
			${optimisticFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-300"}
			${isError ? "animate-shake" : ""}
			${isPending ? "opacity-70" : ""}`}
			onClick={toggleFavorite}
			disabled={isAuthLoading || favoritesLoading}
		>
			{optimisticFavorite ? (
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
