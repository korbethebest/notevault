"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientSupabaseClient } from "@/libs";
import { useAuth } from "@/shared";

type FavoritesContextType = {
	favorites: Set<string>;
	isLoading: boolean;
	isFavorite: (songId: string) => boolean;
	addFavorite: (songId: string) => Promise<boolean>;
	removeFavorite: (songId: string) => Promise<boolean>;
	refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesProviderProps = {
	children: React.ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
	const { user, isSignedIn } = useAuth();
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);

	// 사용자 로그인 시 좋아요 목록 초기 로드
	useEffect(() => {
		if (isSignedIn && user) {
			refreshFavorites();
		} else {
			setFavorites(new Set());
		}
	}, [isSignedIn, user]);

	// 좋아요 목록 새로고침
	const refreshFavorites = async () => {
		if (!isSignedIn || !user) return;

		setIsLoading(true);
		try {
			const {
				data: { session },
			} = await createClientSupabaseClient().auth.getSession();
			if (!session) return;

			const response = await fetch("/api/user/favorites", {
				headers: {
					Authorization: `Bearer ${session.access_token}`,
				},
			});

			if (response.ok) {
				type FavoriteItem = {
					id: string;
					song_id: string;
					Song?: {
						id: string;
						title: string;
						artist: string;
						album?: string;
						cover_image_url?: string;
					} | null;
				};

				type FavoritesResponse = {
					favorites: FavoriteItem[];
				};

				const data = (await response.json()) as FavoritesResponse;
				const favoriteIds = new Set<string>(
					(data.favorites || []).map((fav) => String(fav.song_id)),
				);
				setFavorites(favoriteIds);
			}
		} catch (error) {
			console.error("Error refreshing favorites:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// 좋아요 여부 확인
	const isFavorite = (songId: string): boolean => {
		return favorites.has(songId);
	};

	// 좋아요 추가
	const addFavorite = async (songId: string): Promise<boolean> => {
		if (!isSignedIn || !user) return false;

		try {
			const {
				data: { session },
			} = await createClientSupabaseClient().auth.getSession();
			if (!session) return false;

			// 낙관적 업데이트
			setFavorites((prev) => new Set([...prev, songId]));

			const response = await fetch("/api/user/favorites", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({ songId }),
			});

			if (!response.ok) {
				// 실패 시 롤백
				setFavorites((prev) => {
					const newSet = new Set(prev);
					newSet.delete(songId);
					return newSet;
				});
				return false;
			}

			return true;
		} catch (error) {
			console.error("Error adding favorite:", error);
			// 실패 시 롤백
			setFavorites((prev) => {
				const newSet = new Set(prev);
				newSet.delete(songId);
				return newSet;
			});
			return false;
		}
	};

	// 좋아요 제거
	const removeFavorite = async (songId: string): Promise<boolean> => {
		if (!isSignedIn || !user) return false;

		try {
			const {
				data: { session },
			} = await createClientSupabaseClient().auth.getSession();
			if (!session) return false;

			// 낙관적 업데이트
			setFavorites((prev) => {
				const newSet = new Set(prev);
				newSet.delete(songId);
				return newSet;
			});

			const response = await fetch("/api/user/favorites", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({ songId }),
			});

			if (!response.ok) {
				// 실패 시 롤백
				setFavorites((prev) => new Set([...prev, songId]));
				return false;
			}

			return true;
		} catch (error) {
			console.error("Error removing favorite:", error);
			// 실패 시 롤백
			setFavorites((prev) => new Set([...prev, songId]));
			return false;
		}
	};

	const value: FavoritesContextType = {
		favorites,
		isLoading,
		isFavorite,
		addFavorite,
		removeFavorite,
		refreshFavorites,
	};

	return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (context === undefined) {
		throw new Error("useFavorites must be used within a FavoritesProvider");
	}
	return context;
}
