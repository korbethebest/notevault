import Image from "next/image";
import Link from "next/link";

import type { SpotifyTrack } from "@/entities/track";
import type { WikiData } from "../types";

type ProfileWikiCardProps = {
	wiki: WikiData;
	track: SpotifyTrack;
	index: number;
};

function ProfileWikiCard({ wiki, track, index }: ProfileWikiCardProps) {
	const albumImage = track.album.images.find((img) => img.height >= 300) || track.album.images[0];

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ko-KR", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Link href={`/song/${track.id}`} className="block">
			<div className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors group cursor-pointer">
				{/* 위키 번호 배지 */}
				<div className="flex justify-between items-start mb-3">
					<div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
						Wiki #{index + 1}
					</div>
					<div className="text-zinc-400 text-xs">{formatDate(wiki.updated_at)}</div>
				</div>

				{/* 앨범 커버 */}
				{albumImage && (
					<div className="relative mb-4 aspect-square">
						<Image
							src={albumImage.url}
							alt={track.album.name}
							width={albumImage.width}
							height={albumImage.height}
							className="w-full h-full object-cover rounded-lg"
						/>
						{/* 오버레이 */}
						<div className="absolute inset-0 backdrop-blur-sm bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<div className="text-white text-sm font-medium">위키 보기</div>
						</div>
					</div>
				)}

				{/* 곡 정보 */}
				<div className="space-y-2 mb-3">
					<h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
						{track.name}
					</h3>
					<p className="text-zinc-400 text-xs line-clamp-1">
						{track.artists.map((artist) => artist.name).join(", ")}
					</p>
					<p className="text-zinc-500 text-xs line-clamp-1">{track.album.name}</p>
				</div>

				{/* 위키 보기 버튼 */}
				<div className="border-t border-zinc-700 pt-3">
					<div className="flex justify-end">
						<span className="text-blue-400 text-xs font-medium">위키 보기 →</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default ProfileWikiCard;
