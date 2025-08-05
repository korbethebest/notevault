import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 180,
	height: 180,
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
				borderRadius: "20px",
				position: "relative",
			}}
		>
			{/* Background pattern */}
			<div
				style={{
					position: "absolute",
					top: "20px",
					right: "20px",
					fontSize: "30px",
					color: "rgba(255, 255, 255, 0.3)",
				}}
			>
				♪
			</div>

			<div
				style={{
					position: "absolute",
					bottom: "30px",
					left: "25px",
					fontSize: "20px",
					color: "rgba(255, 255, 255, 0.2)",
				}}
			>
				♫
			</div>

			{/* Main logo */}
			<div
				style={{
					fontSize: "72px",
					color: "white",
					fontWeight: "bold",
					fontFamily: "system-ui, -apple-system, sans-serif",
					textShadow: "0 2px 4px rgba(0,0,0,0.3)",
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
