import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { FavoritesProvider } from "@/features/favorites";
import { AuthWrapper, Modal, ModalProvider } from "@/shared";
import { Footer, HelperIcons } from "@/widgets/footer";
import { Header } from "@/widgets/header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "NoteVault",
		template: "%s | NoteVault",
	},
	description: "음악을 사랑하는 사람들을 위한 공간. 다양한 음악 이야기를 나누세요.",
	keywords: ["음악", "Spotify", "차트", "커뮤니티", "음악 위키", "K-pop", "음악 추천"],
	authors: [{ name: "NoteVault Team" }],
	creator: "NoteVault",
	publisher: "NoteVault",
	metadataBase: new URL("https://notevault-khaki.vercel.app"),
	openGraph: {
		title: "NoteVault - 음악을 사랑하는 사람들의 공간",
		description: "음악을 사랑하는 사람들을 위한 공간. 다양한 음악 이야기를 나누세요.",
		url: "https://notevault-khaki.vercel.app",
		siteName: "NoteVault",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "NoteVault - 음악을 사랑하는 사람들의 공간",
			},
		],
		locale: "ko_KR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "NoteVault - 음악을 사랑하는 사람들의 공간",
		description: "음악을 사랑하는 사람들을 위한 공간. 다양한 음악 이야기를 나누세요.",
		images: ["/twitter-image"],
	},
	icons: {
		icon: "/icon-192.png",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/manifest.json",
};

export const viewport: Viewport = {
	themeColor: "#1DB954",
	colorScheme: "dark",
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ModalProvider>
					<FavoritesProvider>
						<AuthWrapper>
							<Header />
							{children}
							<HelperIcons />
							<Footer />
							<Modal />
						</AuthWrapper>
					</FavoritesProvider>
				</ModalProvider>
			</body>
		</html>
	);
}
