"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "../hooks";

const PUBLIC_PATHS = ["/login", "/signup", "/auth/callback"];

type AuthWrapperProps = {
	children: React.ReactNode;
};

export function AuthWrapper({ children }: AuthWrapperProps) {
	const { isSignedIn, isLoading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	const isPublicPath = PUBLIC_PATHS.includes(pathname);

	useEffect(() => {
		if (isLoading) return;

		if (!isSignedIn && !isPublicPath) {
			router.push("/login");
		}

		if (isSignedIn && (pathname === "/login" || pathname === "/signup")) {
			router.push("/");
		}
	}, [isSignedIn, isLoading, router, pathname, isPublicPath]);

	if (isLoading || (!isSignedIn && !isPublicPath)) {
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="animate-pulse flex flex-col items-center">
					<div className="bg-[#1DB954] w-12 h-12 rounded-full flex items-center justify-center mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-black"
						>
							<path d="M9 18V5l12-2v13"></path>
							<circle cx="6" cy="18" r="3"></circle>
							<circle cx="18" cy="16" r="3"></circle>
						</svg>
					</div>
					<div className="text-white text-lg font-medium">NoteVault</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

export default AuthWrapper;
