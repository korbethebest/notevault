"use client";

import { useRouter } from "next/navigation";

import { useCurrentUser, useSpotifyTrack, useWikiData, useWikiEditor } from "../hooks";
import { TrackInfo } from "./TrackInfo";
import { WikiContent } from "./WikiContent";
import { WikiEditor } from "./WikiEditor";

type SongWikiProps = {
	songId: string;
};

function SongWiki({ songId }: SongWikiProps) {
	const router = useRouter();

	const { trackData, trackLoading } = useSpotifyTrack(songId);
	const { wikiData, loading: wikiLoading, saveWikiData } = useWikiData(songId);
	const { currentUser } = useCurrentUser();

	const {
		isEditing,
		editContent,
		saving,
		setEditContent,
		handleStartEditing,
		handleEdit,
		handleSave,
		handleCancel,
	} = useWikiEditor({ wikiData, saveWikiData, currentUser });

	return (
		<div className="min-h-screen bg-black text-white">
			{/* 헤더 */}
			<div className="border-b border-zinc-800">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<div className="flex items-center gap-4">
						<button
							onClick={() => router.back()}
							className="text-zinc-400 hover:text-white transition-colors"
							title="뒤로 가기"
						>
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
							>
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
						</button>
						<h1 className="text-2xl font-bold">곡 위키</h1>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-8">
				{trackLoading || wikiLoading ? (
					<div className="space-y-6">
						<div className="h-32 bg-zinc-800 animate-pulse rounded-lg" />
						<div className="h-64 bg-zinc-800 animate-pulse rounded-lg" />
					</div>
				) : (
					<>
						{/* Spotify 곡 정보 */}
						{trackData && <TrackInfo trackData={trackData} />}

						{/* 편집 버튼 */}
						{currentUser && !isEditing && (
							<div className="flex justify-between items-center mb-6">
								<div className="text-sm text-zinc-400">
									{wikiData && (
										<>
											마지막 편집: {wikiData.user_nickname} •{" "}
											{new Date(wikiData.updated_at).toLocaleDateString("ko-KR")}
										</>
									)}
								</div>
								<button
									onClick={handleEdit}
									className="px-4 py-2 text-sm bg-[#1DB954] text-black rounded-lg hover:bg-[#1ed760] transition-colors"
								>
									편집
								</button>
							</div>
						)}

						{/* 위키 콘텐츠 */}
						<div className="min-h-96">
							{isEditing ? (
								<WikiEditor
									content={editContent}
									onChange={setEditContent}
									onSave={handleSave}
									onCancel={handleCancel}
									saving={saving}
								/>
							) : (
								<WikiContent
									wikiData={wikiData}
									trackData={trackData}
									currentUser={currentUser}
									onStartEditing={handleStartEditing}
								/>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

export default SongWiki;
