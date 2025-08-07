import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About NoteVault | 음악 공유 커뮤니티",
	description: "NoteVault에 대해 알아보세요.",
};

export default function AboutLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
