import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Song | NoteVault",
};

export default function SongLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
