import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				port: "",
				pathname: "/image/**",
			},
			{
				protocol: "https",
				hostname: "rsfldhdivfwsbkalyhnj.supabase.co",
				port: "",
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
};

export default nextConfig;
