import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Signup | NoteVault",
};

export default function SignupLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
