"use client";

import { useParams } from "next/navigation";

import { SongWiki } from "@/features/wiki";

function SongWikiPage() {
	const params = useParams();
	const songId = params.id as string;

	return <SongWiki songId={songId} />;
}

export default SongWikiPage;
