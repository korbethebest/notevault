import { readFile } from "node:fs/promises";
import { join } from "node:path";

export default async function Image() {
	try {
		// Read the SVG file from the public directory
		const svgPath = join(process.cwd(), "public", "NoteVaultThumbnail.svg");
		const svgContent = await readFile(svgPath, "utf8");

		// Return the SVG content directly
		return new Response(svgContent, {
			headers: {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error loading SVG thumbnail:", error);

		// Fallback to a simple SVG if the file can't be read
		const fallbackSvg = `
			<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
				<rect width="1200" height="630" fill="#0F0F0F"/>
				<text x="600" y="315" text-anchor="middle" dominant-baseline="middle" 
					  fill="#1DB954" font-family="Arial, sans-serif" font-size="80" font-weight="bold">
					NoteVault
				</text>
				<text x="600" y="400" text-anchor="middle" dominant-baseline="middle" 
					  fill="#FFFFFF" font-family="Arial, sans-serif" font-size="32">
					음악을 사랑하는 사람들의 공간
				</text>
			</svg>
		`;

		return new Response(fallbackSvg, {
			headers: {
				"Content-Type": "image/svg+xml",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	}
}
