import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NoteVault - 음악을 사랑하는 사람들의 공간";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#0F0F0F",
				backgroundImage:
					"radial-gradient(circle at 50% 50%, rgba(29, 185, 84, 0.3) 0%, rgba(15, 15, 15, 1) 70%)",
				position: "relative",
			}}
		>
			{/* Music note decorations */}
			<div
				style={{
					position: "absolute",
					top: "100px",
					left: "100px",
					width: "60px",
					height: "60px",
					borderRadius: "50%",
					backgroundColor: "rgba(29, 185, 84, 0.2)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "30px",
					color: "#1DB954",
				}}
			>
				♪
			</div>

			<div
				style={{
					position: "absolute",
					top: "120px",
					right: "150px",
					fontSize: "40px",
					color: "rgba(29, 185, 84, 0.3)",
				}}
			>
				♫
			</div>

			{/* Main content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					textAlign: "center",
				}}
			>
				{/* Logo/Title */}
				<h1
					style={{
						fontSize: "80px",
						fontWeight: "bold",
						background: "linear-gradient(90deg, #1DB954 0%, #1ED760 50%, #1DB954 100%)",
						backgroundClip: "text",
						color: "transparent",
						margin: "0 0 20px 0",
						fontFamily: "system-ui, -apple-system, sans-serif",
					}}
				>
					NoteVault
				</h1>

				{/* Subtitle */}
				<p
					style={{
						fontSize: "32px",
						color: "#FFFFFF",
						margin: "0 0 40px 0",
						fontWeight: "300",
						fontFamily: "system-ui, -apple-system, sans-serif",
					}}
				>
					음악을 사랑하는 사람들의 공간
				</p>

				{/* Features */}
				<div
					style={{
						display: "flex",
						gap: "60px",
						alignItems: "center",
						marginTop: "20px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: "#1DB954",
							}}
						/>
						<span
							style={{
								fontSize: "24px",
								color: "#CCCCCC",
								fontFamily: "system-ui, -apple-system, sans-serif",
							}}
						>
							Spotify 차트
						</span>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: "#1DB954",
							}}
						/>
						<span
							style={{
								fontSize: "24px",
								color: "#CCCCCC",
								fontFamily: "system-ui, -apple-system, sans-serif",
							}}
						>
							음악 위키
						</span>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<div
							style={{
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: "#1DB954",
							}}
						/>
						<span
							style={{
								fontSize: "24px",
								color: "#CCCCCC",
								fontFamily: "system-ui, -apple-system, sans-serif",
							}}
						>
							커뮤니티
						</span>
					</div>
				</div>
			</div>

			{/* Bottom accent */}
			<div
				style={{
					position: "absolute",
					bottom: "0",
					left: "0",
					right: "0",
					height: "8px",
					backgroundColor: "#1DB954",
					opacity: 0.8,
				}}
			/>
		</div>,
		{
			...size,
		},
	);
}
