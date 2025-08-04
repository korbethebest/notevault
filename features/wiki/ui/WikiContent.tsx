import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { SpotifyTrack } from "@/entities/track";
import type { WikiData } from "../types";
import { generateDefaultWikiContent } from "../utils";

interface WikiContentProps {
	wikiData: WikiData | null;
	trackData: SpotifyTrack | null;
	currentUser: any;
	onStartEditing: (content: string) => void;
}

export function WikiContent({
	wikiData,
	trackData,
	currentUser,
	onStartEditing,
}: WikiContentProps) {
	if (wikiData?.content) {
		return (
			<div className="prose prose-invert max-w-none bg-zinc-900 rounded-xl p-6">
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{wikiData.content}</ReactMarkdown>
			</div>
		);
	}

	// 위키가 없을 때 친근한 메시지
	return (
		<div className="bg-zinc-900 rounded-xl p-8 text-center border-2 border-dashed border-zinc-700">
			<div className="mb-4">
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
					className="mx-auto text-zinc-500"
				>
					<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
					<polyline points="14,2 14,8 20,8" />
					<line x1="12" y1="18" x2="12" y2="12" />
					<line x1="9" y1="15" x2="15" y2="15" />
				</svg>
			</div>
			<h3 className="text-xl font-semibold text-white mb-2">처음으로 위키를 작성해보세요!</h3>
			<p className="text-zinc-400 mb-6">
				이 곡에 대한 정보, 가사 해석, 개인적인 감상 등을
				<br />
				자유롭게 작성해보세요. 마크다운 문법을 지원합니다.
			</p>
			{currentUser && (
				<button
					onClick={() => {
						const defaultContent = generateDefaultWikiContent(trackData);
						onStartEditing(defaultContent);
					}}
					className="px-6 py-3 bg-[#1DB954] text-black rounded-lg hover:bg-[#1ed760] transition-colors font-medium"
				>
					위키 작성 시작하기
				</button>
			)}
			{!currentUser && (
				<p className="text-zinc-500 text-sm">위키를 작성하려면 로그인이 필요합니다.</p>
			)}
		</div>
	);
}
