import dynamic from "next/dynamic";

// MDEditor를 동적으로 import (SSR 이슈 방지)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
	ssr: false,
	loading: () => <div className="h-64 bg-zinc-800 animate-pulse rounded-lg" />,
});

interface WikiEditorProps {
	content: string;
	onChange: (content: string) => void;
	onSave: () => void;
	onCancel: () => void;
	saving: boolean;
}

export function WikiEditor({ content, onChange, onSave, onCancel, saving }: WikiEditorProps) {
	return (
		<div className="space-y-4">
			<div className="flex justify-end gap-3">
				<button
					onClick={onCancel}
					className="px-4 py-2 text-sm bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
					disabled={saving}
				>
					취소
				</button>
				<button
					onClick={onSave}
					className="px-4 py-2 text-sm bg-[#1DB954] text-black rounded-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50"
					disabled={saving}
				>
					{saving ? "저장 중..." : "저장"}
				</button>
			</div>
			<div className="h-[600px]">
				<MDEditor
					value={content}
					onChange={(val) => onChange(val || "")}
					data-color-mode="dark"
					height={600}
				/>
			</div>
		</div>
	);
}
