import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Modal, ModalProvider } from "@/shared";
import { Footer } from "@/widgets/footer";
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
	title: "Home | NoteVault",
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
					<Header />
					{children}
					<Footer />
					<Modal />
				</ModalProvider>
			</body>
		</html>
	);
}
