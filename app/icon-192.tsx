import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 192,
	height: 192,
};
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #1DB954 0%, #1ED760 50%, #1DB954 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "24px",
				position: "relative",
			}}
		>
			{/* Background pattern */}
			<div
				style={{
					position: "absolute",
					top: "25px",
					right: "25px",
					fontSize: "32px",
					color: "rgba(255, 255, 255, 0.3)",
				}}
			>
				♪
			</div>

			<div
				style={{
					position: "absolute",
					bottom: "35px",
					left: "30px",
					fontSize: "24px",
					color: "rgba(255, 255, 255, 0.2)",
				}}
			>
				♫
			</div>

			<div
				style={{
					position: "absolute",
					top: "40px",
					left: "40px",
					fontSize: "20px",
					color: "rgba(255, 255, 255, 0.15)",
				}}
			>
				♩
			</div>

			{/* Main logo */}
			<div
				style={{
					fontSize: "96px",
					color: "white",
					fontWeight: "bold",
					fontFamily: "system-ui, -apple-system, sans-serif",
					textShadow: "0 4px 8px rgba(0,0,0,0.3)",
				}}
			>
				N
			</div>
		</div>,
		{
			...size,
		},
	);
}
