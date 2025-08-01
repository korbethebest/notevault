import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Songs | NoteVault",
};

export default function SongsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
