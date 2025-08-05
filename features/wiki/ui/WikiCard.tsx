import Image from "next/image";
import { useRouter } from "next/navigation";

import type { SpotifyTrack } from "@/entities/track";

type WikiData = {
	id: string;
	song_id: string;
	content: string;
	created_at: string;
	updated_at: string;
	user_id: string;
};

type WikiWithTrack = WikiData & {
	track: SpotifyTrack;
};

type WikiCardProps = {
	wiki: WikiWithTrack;
};

export default function WikiCard({ wiki }: WikiCardProps) {
	const router = useRouter();
	const albumImage =
		wiki.track.album.images.find((img) => img.height >= 300) || wiki.track.album.images[0];

	const handleCardClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('a[href*="spotify.com"]')) {
			return;
		}
		router.push(`/song/${wiki.song_id}`);
	};

	return (
		<div
			className="bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800 transition-colors group cursor-pointer"
			onClick={handleCardClick}
		>
			{/* 앨범 커버 */}
			{albumImage && (
				<div className="relative mb-4 aspect-square">
					<Image
						src={albumImage.url}
						alt={wiki.track.album.name}
						width={albumImage.width}
						height={albumImage.height}
						className="w-full h-full object-cover rounded-lg"
					/>
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
				</div>
			)}

			{/* 곡 정보 */}
			<div className="space-y-2 mb-3">
				<h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
					{wiki.track.name}
				</h3>
				<p className="text-zinc-400 text-xs line-clamp-1">
					{wiki.track.artists.map((artist) => artist.name).join(", ")}
				</p>
				<p className="text-zinc-500 text-xs line-clamp-1">{wiki.track.album.name}</p>
			</div>
		</div>
	);
}
