import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
	width: 512,
	height: 512,
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
				borderRadius: "64px",
				position: "relative",
			}}
		>
			{/* Background pattern */}
			<div
				style={{
					position: "absolute",
					top: "60px",
					right: "60px",
					fontSize: "80px",
					color: "rgba(255, 255, 255, 0.3)",
				}}
			>
				♪
			</div>

			<div
				style={{
					position: "absolute",
					bottom: "80px",
					left: "70px",
					fontSize: "60px",
					color: "rgba(255, 255, 255, 0.2)",
				}}
			>
				♫
			</div>

			<div
				style={{
					position: "absolute",
					top: "100px",
					left: "90px",
					fontSize: "50px",
					color: "rgba(255, 255, 255, 0.15)",
				}}
			>
				♩
			</div>

			<div
				style={{
					position: "absolute",
					bottom: "120px",
					right: "100px",
					fontSize: "40px",
					color: "rgba(255, 255, 255, 0.1)",
				}}
			>
				♬
			</div>

			{/* Main logo */}
			<div
				style={{
					fontSize: "256px",
					color: "white",
					fontWeight: "bold",
					fontFamily: "system-ui, -apple-system, sans-serif",
					textShadow: "0 8px 16px rgba(0,0,0,0.3)",
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
