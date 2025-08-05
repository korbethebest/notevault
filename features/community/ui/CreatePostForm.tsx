"use client";

import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Song = {
	id: string;
	title: string;
	artist: string;
	album?: string;
	cover_image_url?: string;
};

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function CreatePostForm() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		song_id: "",
	});
	const [selectedSong, setSelectedSong] = useState<Song | null>(null);
	const [songSearch, setSongSearch] = useState("");
	const [searchResults, setSearchResults] = useState<Song[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [userInfo, setUserInfo] = useState<{ id: string; email: string; nickname: string } | null>(
		null,
	);

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUserId(user.id);

				// User 테이블에서 실제 사용자 정보 가져오기
				const { data: userData, error } = await supabase
					.from("User")
					.select("nickname, email")
					.eq("id", user.id)
					.single();

				if (userData && !error) {
					// User 테이블에서 가져온 데이터 사용
					setUserInfo({
						id: user.id,
						email: userData.email || user.email || "",
						nickname: userData.nickname || "익명의 음악 애호가",
					});
				} else {
					// User 테이블에 데이터가 없으면 user_metadata 사용
					const nickname = user.user_metadata?.nickname || "익명의 음악 애호가";
					setUserInfo({
						id: user.id,
						email: user.email || "",
						nickname: nickname,
					});
				}
			} else {
				router.push("/login");
			}
		};
		getUser();
	}, [router]);

	const searchSongs = async (query: string) => {
		if (!query.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
			if (response.ok) {
				const data = await response.json();
				setSearchResults(data.songs || []);
			}
		} catch (error) {
			console.error("곡 검색 오류:", error);
		} finally {
			setIsSearching(false);
		}
	};

	const selectSong = (song: Song) => {
		setSelectedSong(song);
		setFormData((prev) => ({ ...prev, song_id: song.id }));
		setSongSearch("");
		setSearchResults([]);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (
			!formData.title.trim() ||
			!formData.content.trim() ||
			!formData.song_id ||
			!selectedSong ||
			!userId ||
			!userInfo
		) {
			setError("모든 필드를 입력해주세요");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/community/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					user_id: userId,
					user_info: userInfo,
					song_data: selectedSong,
				}),
			});

			if (response.ok) {
				router.push("/community");
			} else {
				const data = await response.json();
				setError(data.error || "게시글 작성에 실패했습니다");
			}
		} catch (_error) {
			setError("서버 오류가 발생했습니다");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* 에러 메시지 */}
			{error && (
				<div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
					<p className="text-red-400">{error}</p>
				</div>
			)}

			{/* 곡 선택 */}
			<div>
				<div className="block text-sm font-medium text-zinc-300 mb-2">곡 선택 *</div>

				{selectedSong ? (
					<div className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg">
						{selectedSong.cover_image_url && (
							<Image
								src={selectedSong.cover_image_url}
								alt={`${selectedSong.title} cover`}
								fill
								className="w-12 h-12 rounded object-cover"
							/>
						)}
						<div className="flex-1">
							<p className="font-medium text-zinc-200">{selectedSong.title}</p>
							<p className="text-sm text-zinc-400">{selectedSong.artist}</p>
							{selectedSong.album && <p className="text-xs text-zinc-500">{selectedSong.album}</p>}
						</div>
						<button
							type="button"
							onClick={() => {
								setSelectedSong(null);
								setFormData((prev) => ({ ...prev, song_id: "" }));
							}}
							className="text-zinc-400 hover:text-zinc-200 transition-colors"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					</div>
				) : (
					<div className="relative">
						<input
							type="text"
							value={songSearch}
							onChange={(e) => {
								setSongSearch(e.target.value);
								searchSongs(e.target.value);
							}}
							placeholder="곡 제목이나 아티스트명을 검색하세요"
							className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-[#1DB954] focus:outline-none"
						/>

						{/* 검색 결과 */}
						{(searchResults.length > 0 || isSearching) && (
							<div className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
								{isSearching ? (
									<div className="p-4 text-center text-zinc-400">검색 중...</div>
								) : (
									searchResults.map((song) => (
										<button
											key={song.id}
											type="button"
											onClick={() => selectSong(song)}
											className="w-full flex items-center gap-3 p-3 hover:bg-zinc-700 transition-colors text-left"
										>
											{song.cover_image_url && (
												<Image
													src={song.cover_image_url}
													alt={`${song.title} cover`}
													fill
													className="w-10 h-10 rounded object-cover"
												/>
											)}
											<div>
												<p className="font-medium text-zinc-200">{song.title}</p>
												<p className="text-sm text-zinc-400">{song.artist}</p>
											</div>
										</button>
									))
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* 제목 */}
			<div>
				<label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-2">
					제목 *
				</label>
				<input
					type="text"
					id="title"
					value={formData.title}
					onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
					placeholder="게시글 제목을 입력하세요"
					className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-[#1DB954] focus:outline-none"
					required
				/>
			</div>

			{/* 내용 */}
			<div>
				<label htmlFor="content" className="block text-sm font-medium text-zinc-300 mb-2">
					내용 *
				</label>
				<textarea
					id="content"
					value={formData.content}
					onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
					placeholder="이 곡에 대한 생각이나 감상을 자유롭게 작성해보세요"
					rows={8}
					className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-[#1DB954] focus:outline-none resize-none"
					required
				/>
			</div>

			{/* 버튼들 */}
			<div className="flex gap-4 pt-4">
				<Link
					href="/community"
					className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors text-center"
				>
					취소
				</Link>
				<button
					type="submit"
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors"
				>
					{isSubmitting ? "작성 중..." : "게시글 작성"}
				</button>
			</div>
		</form>
	);
}

export default CreatePostForm;
