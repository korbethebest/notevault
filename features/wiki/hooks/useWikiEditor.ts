import type { User } from "@supabase/supabase-js";
import { useState } from "react";

import type { SpotifyTrack } from "@/entities/track";
import type { WikiData } from "../types";

interface UseWikiEditorProps {
	wikiData: WikiData | null;
	saveWikiData: (
		content: string,
		currentUser: User | null,
		trackData?: SpotifyTrack | null,
	) => Promise<boolean>;
	currentUser: User | null;
	trackData?: SpotifyTrack | null;
}

export function useWikiEditor({
	wikiData,
	saveWikiData,
	currentUser,
	trackData,
}: UseWikiEditorProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState("");
	const [saving, setSaving] = useState(false);

	// 편집 시작 (새 위키 작성)
	const handleStartEditing = (content: string) => {
		setEditContent(content);
		setIsEditing(true);
	};

	// 편집 모드 시작 (기존 위키 편집)
	const handleEdit = () => {
		setEditContent(wikiData?.content || "");
		setIsEditing(true);
	};

	// 위키 저장
	const handleSave = async () => {
		setSaving(true);
		try {
			const success = await saveWikiData(editContent, currentUser, trackData);
			if (success) {
				setIsEditing(false);
			} else {
				alert("저장 중 오류가 발생했습니다.");
			}
		} finally {
			setSaving(false);
		}
	};

	// 편집 취소
	const handleCancel = () => {
		setEditContent(wikiData?.content || "");
		setIsEditing(false);
	};

	return {
		// State
		isEditing,
		editContent,
		saving,

		// Actions
		setEditContent,
		handleStartEditing,
		handleEdit,
		handleSave,
		handleCancel,
	};
}
