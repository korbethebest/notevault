function SongSearchLoadingSkeleton() {
	return (
		<div className="bg-zinc-900 rounded-xl p-4 animate-pulse">
			<div className="flex justify-between items-start mb-3">
				<div className="bg-zinc-700 h-5 w-8 rounded-full"></div>
			</div>
			<div className="aspect-square bg-zinc-700 rounded-lg mb-4"></div>
			<div className="space-y-2">
				<div className="h-4 bg-zinc-700 rounded w-full"></div>
				<div className="h-3 bg-zinc-700 rounded w-3/4"></div>
				<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
			</div>
		</div>
	);
}

export default SongSearchLoadingSkeleton;
